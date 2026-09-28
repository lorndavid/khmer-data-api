import { Router } from 'express';
import {
  adminCreateProvince,
  adminUpdateProvince,
  adminDeleteProvince,
  adminCreateDistrict,
  adminUpdateDistrict,
  adminDeleteDistrict,
  adminCreateCommune,
  adminUpdateCommune,
  adminDeleteCommune,
  adminCreateVillage,
  adminUpdateVillage,
  adminDeleteVillage,
  adminCreatePostalCode,
  adminUpdatePostalCode,
  adminDeletePostalCode,
  adminCreateDataSource,
  adminUpdateDataSource,
  adminDeleteDataSource,
  adminListUsers,
  adminCreateUser,
  adminUpdateUser,
  adminDeleteUser,
  adminListApiKeys,
  adminToggleApiKeyStatus,
  adminDeleteApiKey,
  adminListAuditLogs,
  adminListDataImports,
  adminCreateDataImport,
  adminExportData,
  adminGetSystemStatus,
} from './admin.controller.js';
import { authenticateJwt } from '../../common/middleware/auth.middleware.js';
import { requireRole } from '../../common/middleware/rbac.middleware.js';
import { validate } from '../../common/middleware/validate.middleware.js';
import { createProvinceSchema, updateProvinceSchema } from '../provinces/provinces.schema.js';
import { createDistrictSchema, updateDistrictSchema } from '../districts/districts.schema.js';
import { createCommuneSchema, updateCommuneSchema } from '../communes/communes.schema.js';
import { createVillageSchema, updateVillageSchema } from '../villages/villages.schema.js';
import {
  createPostalCodeSchema,
  updatePostalCodeSchema,
} from '../postal-codes/postal-codes.schema.js';

const router = Router();

// Protect all admin routes with JWT and Admin/SuperAdmin/DataManager roles
router.use(authenticateJwt);
router.use(requireRole('super_admin', 'admin', 'data_manager'));

// 1. Provinces
router.post('/provinces', validate({ body: createProvinceSchema }), adminCreateProvince);
router.patch('/provinces/:id', validate({ body: updateProvinceSchema }), adminUpdateProvince);
router.delete('/provinces/:id', adminDeleteProvince);

// 2. Districts
router.post('/districts', validate({ body: createDistrictSchema }), adminCreateDistrict);
router.patch('/districts/:id', validate({ body: updateDistrictSchema }), adminUpdateDistrict);
router.delete('/districts/:id', adminDeleteDistrict);

// 3. Communes
router.post('/communes', validate({ body: createCommuneSchema }), adminCreateCommune);
router.patch('/communes/:id', validate({ body: updateCommuneSchema }), adminUpdateCommune);
router.delete('/communes/:id', adminDeleteCommune);

// 4. Villages
router.post('/villages', validate({ body: createVillageSchema }), adminCreateVillage);
router.patch('/villages/:id', validate({ body: updateVillageSchema }), adminUpdateVillage);
router.delete('/villages/:id', adminDeleteVillage);

// 5. Postal codes
router.post('/postal-codes', validate({ body: createPostalCodeSchema }), adminCreatePostalCode);
router.patch(
  '/postal-codes/:id',
  validate({ body: updatePostalCodeSchema }),
  adminUpdatePostalCode,
);
router.delete('/postal-codes/:id', adminDeletePostalCode);

// 6. Data Sources
router.post('/data-sources', adminCreateDataSource);
router.patch('/data-sources/:id', adminUpdateDataSource);
router.delete('/data-sources/:id', adminDeleteDataSource);

// 7. Data Imports & Exports
router.get('/data-imports', adminListDataImports);
router.post('/data-imports', adminCreateDataImport);
router.get('/export/:resource', adminExportData);

// 8. Users & Access Management (Requires super_admin or admin)
router.get('/users', requireRole('super_admin', 'admin'), adminListUsers);
router.post('/users', requireRole('super_admin', 'admin'), adminCreateUser);
router.patch('/users/:id', requireRole('super_admin', 'admin'), adminUpdateUser);
router.delete('/users/:id', requireRole('super_admin', 'admin'), adminDeleteUser);

// 9. API Keys Management
router.get('/api-keys', requireRole('super_admin', 'admin'), adminListApiKeys);
router.patch('/api-keys/:id/status', requireRole('super_admin', 'admin'), adminToggleApiKeyStatus);
router.delete('/api-keys/:id', requireRole('super_admin', 'admin'), adminDeleteApiKey);

// 10. Audit Logs & System Status
router.get('/audit-logs', requireRole('super_admin', 'admin'), adminListAuditLogs);
router.get('/system', requireRole('super_admin', 'admin'), adminGetSystemStatus);

export const adminRoutes = router;
