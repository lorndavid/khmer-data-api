import { Router } from 'express';
import { listProvinces, getProvinceByCode, getProvinceDistricts } from './provinces.controller.js';
import { validate } from '../../common/middleware/validate.middleware.js';
import { listProvincesQuerySchema, provinceCodeParamSchema } from './provinces.schema.js';

const router = Router();

router.get('/', validate({ query: listProvincesQuerySchema }), listProvinces);
router.get('/:code', validate({ params: provinceCodeParamSchema }), getProvinceByCode);
router.get('/:code/districts', validate({ params: provinceCodeParamSchema }), getProvinceDistricts);

export const provincesRoutes = router;
