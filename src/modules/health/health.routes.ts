import { Router } from 'express';
import { getHealth, getReady, getLive } from './health.controller.js';

const router = Router();

router.get('/health', getHealth);
router.get('/ready', getReady);
router.get('/live', getLive);

export const healthRoutes = router;
