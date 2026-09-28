import { Router } from 'express';
import { listVillages, getVillageByCode } from './villages.controller.js';
import { validate } from '../../common/middleware/validate.middleware.js';
import { listVillagesQuerySchema, villageCodeParamSchema } from './villages.schema.js';

const router = Router();

router.get('/', validate({ query: listVillagesQuerySchema }), listVillages);
router.get('/:code', validate({ params: villageCodeParamSchema }), getVillageByCode);

export const villagesRoutes = router;
