import { Router } from 'express';
import { listDistricts, getDistrictByCode, getDistrictCommunes } from './districts.controller.js';
import { validate } from '../../common/middleware/validate.middleware.js';
import { listDistrictsQuerySchema, districtCodeParamSchema } from './districts.schema.js';

const router = Router();

router.get('/', validate({ query: listDistrictsQuerySchema }), listDistricts);
router.get('/:code', validate({ params: districtCodeParamSchema }), getDistrictByCode);
router.get('/:code/communes', validate({ params: districtCodeParamSchema }), getDistrictCommunes);

export const districtsRoutes = router;
