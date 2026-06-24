import prisma from '../prisma/client';

export const addOrUpdateRating = async (userId: string, tmdbId: number, rating: number) => {
  const existing = await prisma.movieRating.findFirst({ where: { userId, tmdbId } });

  if (existing) {
    return prisma.movieRating.update({
      where: { id: existing.id },
      data: { rating },
    });
  }

  return prisma.movieRating.create({
    data: { userId, tmdbId, rating },
  });
};

export const updateRating = async (ratingId: string, userId: string, rating: number) => {
  return prisma.movieRating.updateMany({
    where: { id: ratingId, userId },
    data: { rating },
  });
};

export const getRatings = async (userId: string) => {
  return prisma.movieRating.findMany({ where: { userId } });
};
