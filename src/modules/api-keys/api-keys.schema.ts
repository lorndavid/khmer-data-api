import { z } from 'zod';

export const createApiKeySchema = z.object({
  name: z.string().min(1, 'API key name is required').max(100),
  expires_in_days: z.number().int().positive().optional(),
});

export const apiKeyIdParamSchema = z.object({
  id: z.string().uuid('Invalid API key ID format'),
});

export type CreateApiKeyInput = z.infer<typeof createApiKeySchema>;
