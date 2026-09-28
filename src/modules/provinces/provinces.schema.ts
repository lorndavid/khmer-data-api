import { z } from 'zod';

export const listProvincesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  search: z.string().max(100).optional(),
  sort: z.enum(['name_en', 'name_km', 'code', 'created_at', 'updated_at']).optional(),
  order: z.enum(['asc', 'desc', 'ASC', 'DESC']).optional(),
  active: z
    .string()
    .optional()
    .transform((val) => (val === undefined ? undefined : val === 'true')),
});

export const provinceCodeParamSchema = z.object({
  code: z.string().min(1).max(10),
});

export const createProvinceSchema = z.object({
  code: z.string().min(2, 'Province code is required').max(10),
  name_km: z.string().min(1, 'Khmer name is required').max(150),
  name_en: z.string().min(1, 'English name is required').max(150),
  slug: z.string().max(150).optional(),
  type: z.string().default('Province').optional(),
  country_id: z.string().uuid().optional(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  is_active: z.boolean().default(true).optional(),
});

export const updateProvinceSchema = createProvinceSchema.partial();

export type ListProvincesQuery = z.infer<typeof listProvincesQuerySchema>;
export type CreateProvinceInput = z.infer<typeof createProvinceSchema>;
export type UpdateProvinceInput = z.infer<typeof updateProvinceSchema>;
