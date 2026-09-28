import { z } from 'zod';

export const listPostalCodesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  postal_code: z.string().optional(),
  province_code: z.string().optional(),
  district_code: z.string().optional(),
  commune_code: z.string().optional(),
  search: z.string().max(100).optional(),
  sort: z.enum(['postal_code', 'created_at', 'updated_at']).optional(),
  order: z.enum(['asc', 'desc', 'ASC', 'DESC']).optional(),
  active: z
    .string()
    .optional()
    .transform((val) => (val === undefined ? undefined : val === 'true')),
});

export const postalCodeParamSchema = z.object({
  postalCode: z.string().min(1).max(20),
});

export const createPostalCodeSchema = z.object({
  postal_code: z.string().min(3, 'Postal code is required').max(20),
  province_id: z.string().uuid('Valid province ID is required'),
  district_id: z.string().uuid().optional().nullable(),
  commune_id: z.string().uuid().optional().nullable(),
  is_active: z.boolean().default(true).optional(),
});

export const updatePostalCodeSchema = createPostalCodeSchema.partial();

export type ListPostalCodesQuery = z.infer<typeof listPostalCodesQuerySchema>;
export type CreatePostalCodeInput = z.infer<typeof createPostalCodeSchema>;
export type UpdatePostalCodeInput = z.infer<typeof updatePostalCodeSchema>;
