import { Router } from 'express';
import { search } from './search.controller.js';
import { validate } from '../../common/middleware/validate.middleware.js';
import { searchQuerySchema } from './search.schema.js';

const router = Router();

router.get('/', validate({ query: searchQuerySchema }), search);

export const searchRoutes = router;
