import { Router } from 'express';
import { listPostalCodes, getPostalCode } from './postal-codes.controller.js';
import { validate } from '../../common/middleware/validate.middleware.js';
import { listPostalCodesQuerySchema, postalCodeParamSchema } from './postal-codes.schema.js';

const router = Router();

router.get('/', validate({ query: listPostalCodesQuerySchema }), listPostalCodes);
router.get('/:postalCode', validate({ params: postalCodeParamSchema }), getPostalCode);

export const postalCodesRoutes = router;
