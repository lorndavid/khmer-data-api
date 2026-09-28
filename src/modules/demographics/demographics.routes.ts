import { Router } from 'express';
import { demographicsController } from './demographics.controller.js';

export const demographicsRoutes = Router();

// GET /api/v1/demographics/population - Historical Population & Demographics
demographicsRoutes.get('/population', demographicsController.getPopulation);
demographicsRoutes.get('/', demographicsController.getPopulation);
