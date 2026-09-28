import { z } from 'zod';

export const listVillagesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  commune_code: z.string().optional(),
  commune_id: z.string().optional(),
  district_code: z.string().optional(),
  province_code: z.string().optional(),
  search: z.string().max(100).optional(),
  sort: z.enum(['name_en', 'name_km', 'code', 'created_at', 'updated_at']).optional(),
  order: z.enum(['asc', 'desc', 'ASC', 'DESC']).optional(),
  active: z
    .string()
    .optional()
    .transform((val) => (val === undefined ? undefined : val === 'true')),
});

export const villageCodeParamSchema = z.object({
  code: z.string().min(1).max(12),
});

export const createVillageSchema = z.object({
  code: z.string().min(2, 'Village code is required').max(12),
  commune_id: z.string().uuid('Valid commune ID is required'),
  name_km: z.string().min(1, 'Khmer name is required').max(150),
  name_en: z.string().min(1, 'English name is required').max(150),
  slug: z.string().max(150).optional(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  is_active: z.boolean().default(true).optional(),
});

export const updateVillageSchema = createVillageSchema.partial();

export type ListVillagesQuery = z.infer<typeof listVillagesQuerySchema>;
export type CreateVillageInput = z.infer<typeof createVillageSchema>;
export type UpdateVillageInput = z.infer<typeof updateVillageSchema>;
