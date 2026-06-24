import prisma from '../prisma/client';

export const addWatchedMovie = async (userId: string, tmdbId: number, title: string, poster?: string) => {
  return prisma.watchedMovie.create({
    data: { userId, tmdbId, title, poster },
  });
};

export const removeWatchedMovie = async (userId: string, tmdbId: number) => {
  return prisma.watchedMovie.deleteMany({
    where: { userId, tmdbId },
  });
};

export const getWatchedMovies = async (userId: string) => {
  return prisma.watchedMovie.findMany({
    where: { userId },
    orderBy: { watchedAt: 'desc' },
  });
};
