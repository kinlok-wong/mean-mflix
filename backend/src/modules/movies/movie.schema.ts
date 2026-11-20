import { z } from 'zod';

export const movieQuerySchema = z.object({
  search: z.string().trim().min(1).max(100).optional(),

  genre: z.string().trim().min(1).max(50).optional(),

  year: z.coerce.number().int().min(1888).max(2100).optional(),

  sortBy: z.enum([
    'year',
    'title',
    'rating',
    'released',
  ]).default('year'),

  sortOrder: z.enum([
    'asc',
    'desc',
  ]).default('desc'),

  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export type MovieQuery = z.infer<typeof movieQuerySchema>;