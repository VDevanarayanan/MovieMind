import { z } from 'zod';

export const ratingSchema = z.object({
  tmdbId: z.number().int(),
  rating: z.number().int().min(1).max(10),
});
