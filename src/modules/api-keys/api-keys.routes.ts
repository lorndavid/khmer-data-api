import { Router } from 'express';
import { createApiKey, listApiKeys, deleteApiKey } from './api-keys.controller.js';
import { validate } from '../../common/middleware/validate.middleware.js';
import { createApiKeySchema, apiKeyIdParamSchema } from './api-keys.schema.js';
import { authenticateJwt } from '../../common/middleware/auth.middleware.js';

const router = Router();

router.use(authenticateJwt);

router.post('/', validate({ body: createApiKeySchema }), createApiKey);
router.get('/', listApiKeys);
router.delete('/:id', validate({ params: apiKeyIdParamSchema }), deleteApiKey);

export const apiKeysRoutes = router;
