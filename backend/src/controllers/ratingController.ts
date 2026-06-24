import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { addOrUpdateRating, getRatings, updateRating } from '../services/ratingService';

export const rateMovieHandler = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const { tmdbId, rating } = req.body;
    const result = await addOrUpdateRating(userId, Number(tmdbId), Number(rating));
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateRatingHandler = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const ratingId = req.params.id;
    const { rating } = req.body;
    const result = await updateRating(ratingId, userId, Number(rating));
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getRatingsHandler = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const ratings = await getRatings(userId);
    res.json(ratings);
  } catch (error) {
    next(error);
  }
};
