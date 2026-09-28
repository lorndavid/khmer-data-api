import { Router } from 'express';
import { provincesRoutes } from '../modules/provinces/provinces.routes.js';
import { districtsRoutes } from '../modules/districts/districts.routes.js';
import { communesRoutes } from '../modules/communes/communes.routes.js';
import { villagesRoutes } from '../modules/villages/villages.routes.js';
import { postalCodesRoutes } from '../modules/postal-codes/postal-codes.routes.js';
import { locationsRoutes } from '../modules/locations/locations.routes.js';
import { searchRoutes } from '../modules/search/search.routes.js';
import { geoRoutes } from '../modules/geo/geo.routes.js';
import { statisticsRoutes } from '../modules/statistics/statistics.routes.js';
import { dataSourcesRoutes } from '../modules/data-sources/data-sources.routes.js';
import { authRoutes } from '../modules/auth/auth.routes.js';
import { apiKeysRoutes } from '../modules/api-keys/api-keys.routes.js';
import { adminRoutes } from '../modules/admin/admin.routes.js';
import { optionalApiKey } from '../common/middleware/api-key.middleware.js';
import { optionalAuth } from '../common/middleware/auth.middleware.js';
import { rateLimiterMiddleware } from '../common/middleware/rate-limiter.middleware.js';
import { usageLoggerMiddleware } from '../common/middleware/usage-logger.middleware.js';

const apiV1Router = Router();

// Apply identity resolution & rate limiting for all /api/v1 endpoints
apiV1Router.use(optionalAuth);
apiV1Router.use(optionalApiKey);
apiV1Router.use(rateLimiterMiddleware());
apiV1Router.use(usageLoggerMiddleware());

// Mount core geographic data modules
apiV1Router.use('/provinces', provincesRoutes);
apiV1Router.use('/districts', districtsRoutes);
apiV1Router.use('/communes', communesRoutes);
apiV1Router.use('/villages', villagesRoutes);
apiV1Router.use('/postal-codes', postalCodesRoutes);
apiV1Router.use('/locations', locationsRoutes);

// Search & Analytics
apiV1Router.use('/search', searchRoutes);
apiV1Router.use('/geo', geoRoutes);
apiV1Router.use('/statistics', statisticsRoutes);
apiV1Router.use('/data-sources', dataSourcesRoutes);

// Identity & Developer accounts
apiV1Router.use('/auth', authRoutes);
apiV1Router.use('/api-keys', apiKeysRoutes);

// Admin platform management
apiV1Router.use('/admin', adminRoutes);

// Root Router mounting versioned APIs
const rootRouter = Router();
rootRouter.use('/api/v1', apiV1Router);

// Extensible placeholder for future API versions (/api/v2)
const apiV2Router = Router();
apiV2Router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'KhmerAPI v2 is currently in development. Please use /api/v1',
    meta: { request_id: req.id, timestamp: new Date().toISOString() },
  });
});
rootRouter.use('/api/v2', apiV2Router);

export { rootRouter, apiV1Router };
