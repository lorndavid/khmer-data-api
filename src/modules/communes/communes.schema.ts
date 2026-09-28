import { z } from 'zod';

export const listCommunesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  district_code: z.string().optional(),
  district_id: z.string().optional(),
  province_code: z.string().optional(),
  search: z.string().max(100).optional(),
  type: z.string().optional(),
  sort: z.enum(['name_en', 'name_km', 'code', 'created_at', 'updated_at']).optional(),
  order: z.enum(['asc', 'desc', 'ASC', 'DESC']).optional(),
  active: z
    .string()
    .optional()
    .transform((val) => (val === undefined ? undefined : val === 'true')),
});

export const communeCodeParamSchema = z.object({
  code: z.string().min(1).max(10),
});

export const createCommuneSchema = z.object({
  code: z.string().min(2, 'Commune code is required').max(10),
  district_id: z.string().uuid('Valid district ID is required'),
  name_km: z.string().min(1, 'Khmer name is required').max(150),
  name_en: z.string().min(1, 'English name is required').max(150),
  slug: z.string().max(150).optional(),
  type: z.string().default('Commune').optional(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  is_active: z.boolean().default(true).optional(),
});

export const updateCommuneSchema = createCommuneSchema.partial();

export type ListCommunesQuery = z.infer<typeof listCommunesQuerySchema>;
export type CreateCommuneInput = z.infer<typeof createCommuneSchema>;
export type UpdateCommuneInput = z.infer<typeof updateCommuneSchema>;
