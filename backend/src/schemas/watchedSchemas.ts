import { z } from 'zod';

export const watchedSchema = z.object({
  tmdbId: z.number().int(),
  title: z.string().min(1),
  poster: z.string().optional(),
});
