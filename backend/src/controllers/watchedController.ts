import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { addWatchedMovie, getWatchedMovies, removeWatchedMovie } from '../services/watchedService';

export const addWatchedHandler = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const { tmdbId, title, poster } = req.body;
    const movie = await addWatchedMovie(userId, Number(tmdbId), title, poster);
    res.status(201).json(movie);
  } catch (error) {
    next(error);
  }
};

export const removeWatchedHandler = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const tmdbId = Number(req.params.tmdbId);
    await removeWatchedMovie(userId, tmdbId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getWatchedHandler = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const movies = await getWatchedMovies(userId);
    res.json(movies);
  } catch (error) {
    next(error);
  }
};
