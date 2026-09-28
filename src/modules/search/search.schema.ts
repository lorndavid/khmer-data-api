import { z } from 'zod';

export const searchQuerySchema = z.object({
  q: z
    .string()
    .min(1, 'Search query q is required')
    .max(100, 'Search query cannot exceed 100 characters'),
  type: z
    .enum(['all', 'province', 'district', 'commune', 'village', 'postal_code'])
    .default('all')
    .optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20).optional(),
});

export type SearchQueryInput = z.infer<typeof searchQuerySchema>;
