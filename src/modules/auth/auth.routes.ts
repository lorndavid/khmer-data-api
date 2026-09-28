import { Router } from 'express';
import { register, login, refresh, logout, getMe } from './auth.controller.js';
import { validate } from '../../common/middleware/validate.middleware.js';
import { registerSchema, loginSchema, refreshSchema } from './auth.schema.js';
import { authenticateJwt } from '../../common/middleware/auth.middleware.js';

const router = Router();

router.post('/register', validate({ body: registerSchema }), register);
router.post('/login', validate({ body: loginSchema }), login);
router.post('/refresh', validate({ body: refreshSchema }), refresh);
router.post('/logout', logout);
router.get('/me', authenticateJwt, getMe);

export const authRoutes = router;
