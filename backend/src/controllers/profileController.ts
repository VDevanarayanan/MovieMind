import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../prisma/client';
import { getMovieDetail } from '../services/movieService';

export const getProfileStatsHandler = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const watched = await prisma.watchedMovie.findMany({ where: { userId } });
    const ratings = await prisma.movieRating.findMany({ where: { userId } });

    const totalWatched = watched.length;
    const averageRating = ratings.length ? ratings.reduce((sum, item) => sum + item.rating, 0) / ratings.length : 0;
    const topRatings = ratings.slice().sort((a, b) => b.rating - a.rating).slice(0, 5);
    const highestRated = await Promise.all(
      topRatings.map(async (rating) => {
        const details = await getMovieDetail(rating.tmdbId);
        return {
          ...rating,
          title: details.title || `Movie ${rating.tmdbId}`,
        };
      }),
    );

    const ratedMovies = await Promise.all(
      ratings
        .slice()
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 8)
        .map(async (rating) => {
          const details = await getMovieDetail(rating.tmdbId);
          return {
            tmdbId: rating.tmdbId,
            title: details.title || `Movie ${rating.tmdbId}`,
            rating: rating.rating,
          };
        }),
    );

    const genreCounts = {} as Record<string, number>;
    for (const rating of ratings) {
      try {
        const details = await getMovieDetail(rating.tmdbId);
        const genres: Array<{ id: number; name: string }> = details.genres || [];
        genres.forEach((genre) => {
          genreCounts[genre.name] = (genreCounts[genre.name] || 0) + 1;
        });
      } catch {
        // ignore missing details
      }
    }

    const favoriteGenres = Object.entries(genreCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([genre]) => genre);

    res.json({
      totalWatched,
      averageRating: Number(averageRating.toFixed(1)),
      highestRated,
      ratedMovies,
      recentlyWatched: watched.slice(0, 5),
      favoriteGenres,
    });
  } catch (error) {
    next(error);
  }
};
