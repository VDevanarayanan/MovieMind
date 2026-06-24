import { Request, Response, NextFunction } from 'express';
import { getMovieDetail, getPopularMovies, getTrendingMovies, searchMovieCatalog } from '../services/movieService';

export const searchMoviesHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = String(req.query.q || '');
    const results = await searchMovieCatalog(query);
    res.json(results);
  } catch (error) {
    next(error);
  }
};

export const trendingMoviesHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const results = await getTrendingMovies();
    res.json(results);
  } catch (error) {
    next(error);
  }
};

export const popularMoviesHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const results = await getPopularMovies();
    res.json(results);
  } catch (error) {
    next(error);
  }
};

export const movieDetailsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tmdbId = Number(req.params.id);
    const details = await getMovieDetail(tmdbId);
    res.json(details);
  } catch (error) {
    next(error);
  }
};
