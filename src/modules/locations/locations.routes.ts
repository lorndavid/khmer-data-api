import { Router } from 'express';
import { getLocationByCode } from './locations.controller.js';
import { validate } from '../../common/middleware/validate.middleware.js';
import { z } from 'zod';

const router = Router();

router.get(
  '/:code',
  validate({
    params: z.object({
      code: z.string().min(1).max(20),
    }),
  }),
  getLocationByCode,
);

export const locationsRoutes = router;
