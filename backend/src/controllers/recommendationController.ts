import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { generateRecommendations, getRecommendationCache } from '../services/recommendationService';

export const getRecommendationsHandler = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const cached = await getRecommendationCache(userId);
    if (cached) {
      return res.json({ source: 'cache', recommendations: cached });
    }

    const recommendations = await generateRecommendations(userId);
    res.json({ source: 'ai', recommendations });
  } catch (error) {
    next(error);
  }
};
