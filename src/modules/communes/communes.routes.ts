import { Router } from 'express';
import { listCommunes, getCommuneByCode, getCommuneVillages } from './communes.controller.js';
import { validate } from '../../common/middleware/validate.middleware.js';
import { listCommunesQuerySchema, communeCodeParamSchema } from './communes.schema.js';

const router = Router();

router.get('/', validate({ query: listCommunesQuerySchema }), listCommunes);
router.get('/:code', validate({ params: communeCodeParamSchema }), getCommuneByCode);
router.get('/:code/villages', validate({ params: communeCodeParamSchema }), getCommuneVillages);

export const communesRoutes = router;
