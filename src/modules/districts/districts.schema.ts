import { z } from 'zod';

export const listDistrictsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  province_code: z.string().optional(),
  province_id: z.string().optional(),
  search: z.string().max(100).optional(),
  type: z.string().optional(),
  sort: z.enum(['name_en', 'name_km', 'code', 'created_at', 'updated_at']).optional(),
  order: z.enum(['asc', 'desc', 'ASC', 'DESC']).optional(),
  active: z
    .string()
    .optional()
    .transform((val) => (val === undefined ? undefined : val === 'true')),
});

export const districtCodeParamSchema = z.object({
  code: z.string().min(1).max(10),
});

export const createDistrictSchema = z.object({
  code: z.string().min(2, 'District code is required').max(10),
  province_id: z.string().uuid('Valid province ID is required'),
  name_km: z.string().min(1, 'Khmer name is required').max(150),
  name_en: z.string().min(1, 'English name is required').max(150),
  slug: z.string().max(150).optional(),
  type: z.string().default('District').optional(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  is_active: z.boolean().default(true).optional(),
});

export const updateDistrictSchema = createDistrictSchema.partial();

export type ListDistrictsQuery = z.infer<typeof listDistrictsQuerySchema>;
export type CreateDistrictInput = z.infer<typeof createDistrictSchema>;
export type UpdateDistrictInput = z.infer<typeof updateDistrictSchema>;
