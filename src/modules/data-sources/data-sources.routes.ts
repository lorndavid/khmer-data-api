import { Router } from 'express';
import { listDataSources, getDataSourceById } from './data-sources.controller.js';

const router = Router();

router.get('/', listDataSources);
router.get('/:id', getDataSourceById);

export const dataSourcesRoutes = router;
