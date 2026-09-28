import { Router } from 'express';
import {
  getGeoProvinces,
  getGeoDistricts,
  getGeoCommunes,
  getGeoVillages,
  getGeoLayer,
} from './geo.controller.js';

const router = Router();

router.get('/provinces', getGeoProvinces);
router.get('/districts', getGeoDistricts);
router.get('/communes', getGeoCommunes);
router.get('/villages', getGeoVillages);
router.get('/layers/:layer', getGeoLayer);

export const geoRoutes = router;

