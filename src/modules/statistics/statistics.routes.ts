import { Router } from 'express';
import { getStatistics } from './statistics.controller.js';

const router = Router();

router.get('/', getStatistics);

export const statisticsRoutes = router;
