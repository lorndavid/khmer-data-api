import { Request, Response, NextFunction } from 'express';
import os from 'node:os';
import { provincesService } from '../provinces/provinces.service.js';
import { districtsService } from '../districts/districts.service.js';
import { communesService } from '../communes/communes.service.js';
import { villagesService } from '../villages/villages.service.js';
import { postalCodesService } from '../postal-codes/postal-codes.service.js';
import { dataSourcesService } from '../data-sources/data-sources.service.js';
import { adminAuditService } from './admin-audit.service.js';
import { exportService } from './admin-export.service.js';
import { dataImportService } from './admin-import.service.js';
import { prisma } from '../../config/database.js';
import { checkDatabaseConnection } from '../../config/database.js';
import { checkRedisConnection } from '../../config/redis.js';
import { hashPassword } from '../../common/utils/crypto.js';
import {
  sendCreated,
  sendSuccess,
  sendNoContent,
  sendCollection,
} from '../../common/utils/response.js';
import { NotFoundError, ConflictError } from '../../common/errors/index.js';

// ==================== PROVINCES ADMIN ====================
export async function adminCreateProvince(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const province = await provincesService.createProvince(req.body);
    await adminAuditService.recordAudit(
      req,
      'ADMIN_CREATE_PROVINCE',
      'provinces',
      province.id,
      null,
      province,
    );
    sendCreated(res, province);
  } catch (error) {
    next(error);
  }
}

export async function adminUpdateProvince(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const oldProvince = await prisma.province.findFirst({
      where: { OR: [{ id: req.params.id }, { code: req.params.id }] },
    });
    const province = await provincesService.updateProvince(req.params.id, req.body);
    await adminAuditService.recordAudit(
      req,
      'ADMIN_UPDATE_PROVINCE',
      'provinces',
      province.id,
      oldProvince,
      province,
    );
    sendSuccess(res, province);
  } catch (error) {
    next(error);
  }
}

export async function adminDeleteProvince(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const oldProvince = await prisma.province.findFirst({
      where: { OR: [{ id: req.params.id }, { code: req.params.id }] },
    });
    await provincesService.deleteProvince(req.params.id);
    await adminAuditService.recordAudit(
      req,
      'ADMIN_DELETE_PROVINCE',
      'provinces',
      req.params.id,
      oldProvince,
      null,
    );
    sendNoContent(res);
  } catch (error) {
    next(error);
  }
}

// ==================== DISTRICTS ADMIN ====================
export async function adminCreateDistrict(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const district = await districtsService.createDistrict(req.body);
    await adminAuditService.recordAudit(
      req,
      'ADMIN_CREATE_DISTRICT',
      'districts',
      district.id,
      null,
      district,
    );
    sendCreated(res, district);
  } catch (error) {
    next(error);
  }
}

export async function adminUpdateDistrict(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const oldDistrict = await prisma.district.findFirst({
      where: { OR: [{ id: req.params.id }, { code: req.params.id }] },
    });
    const district = await districtsService.updateDistrict(req.params.id, req.body);
    await adminAuditService.recordAudit(
      req,
      'ADMIN_UPDATE_DISTRICT',
      'districts',
      district.id,
      oldDistrict,
      district,
    );
    sendSuccess(res, district);
  } catch (error) {
    next(error);
  }
}

export async function adminDeleteDistrict(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const oldDistrict = await prisma.district.findFirst({
      where: { OR: [{ id: req.params.id }, { code: req.params.id }] },
    });
    await districtsService.deleteDistrict(req.params.id);
    await adminAuditService.recordAudit(
      req,
      'ADMIN_DELETE_DISTRICT',
      'districts',
      req.params.id,
      oldDistrict,
      null,
    );
    sendNoContent(res);
  } catch (error) {
    next(error);
  }
}

// ==================== COMMUNES ADMIN ====================
export async function adminCreateCommune(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const commune = await communesService.createCommune(req.body);
    await adminAuditService.recordAudit(
      req,
      'ADMIN_CREATE_COMMUNE',
      'communes',
      commune.id,
      null,
      commune,
    );
    sendCreated(res, commune);
  } catch (error) {
    next(error);
  }
}

export async function adminUpdateCommune(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const oldCommune = await prisma.commune.findFirst({
      where: { OR: [{ id: req.params.id }, { code: req.params.id }] },
    });
    const commune = await communesService.updateCommune(req.params.id, req.body);
    await adminAuditService.recordAudit(
      req,
      'ADMIN_UPDATE_COMMUNE',
      'communes',
      commune.id,
      oldCommune,
      commune,
    );
    sendSuccess(res, commune);
  } catch (error) {
    next(error);
  }
}

export async function adminDeleteCommune(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const oldCommune = await prisma.commune.findFirst({
      where: { OR: [{ id: req.params.id }, { code: req.params.id }] },
    });
    await communesService.deleteCommune(req.params.id);
    await adminAuditService.recordAudit(
      req,
      'ADMIN_DELETE_COMMUNE',
      'communes',
      req.params.id,
      oldCommune,
      null,
    );
    sendNoContent(res);
  } catch (error) {
    next(error);
  }
}

// ==================== VILLAGES ADMIN ====================
export async function adminCreateVillage(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const village = await villagesService.createVillage(req.body);
    await adminAuditService.recordAudit(
      req,
      'ADMIN_CREATE_VILLAGE',
      'villages',
      village.id,
      null,
      village,
    );
    sendCreated(res, village);
  } catch (error) {
    next(error);
  }
}

export async function adminUpdateVillage(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const oldVillage = await prisma.village.findFirst({
      where: { OR: [{ id: req.params.id }, { code: req.params.id }] },
    });
    const village = await villagesService.updateVillage(req.params.id, req.body);
    await adminAuditService.recordAudit(
      req,
      'ADMIN_UPDATE_VILLAGE',
      'villages',
      village.id,
      oldVillage,
      village,
    );
    sendSuccess(res, village);
  } catch (error) {
    next(error);
  }
}

export async function adminDeleteVillage(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const oldVillage = await prisma.village.findFirst({
      where: { OR: [{ id: req.params.id }, { code: req.params.id }] },
    });
    await villagesService.deleteVillage(req.params.id);
    await adminAuditService.recordAudit(
      req,
      'ADMIN_DELETE_VILLAGE',
      'villages',
      req.params.id,
      oldVillage,
      null,
    );
    sendNoContent(res);
  } catch (error) {
    next(error);
  }
}

// ==================== POSTAL CODES ADMIN ====================
export async function adminCreatePostalCode(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const record = await postalCodesService.createPostalCode(req.body);
    await adminAuditService.recordAudit(
      req,
      'ADMIN_CREATE_POSTAL_CODE',
      'postal_codes',
      record.id,
      null,
      record,
    );
    sendCreated(res, record);
  } catch (error) {
    next(error);
  }
}

export async function adminUpdatePostalCode(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const oldRecord = await prisma.postalCode.findUnique({ where: { id: req.params.id } });
    const record = await postalCodesService.updatePostalCode(req.params.id, req.body);
    await adminAuditService.recordAudit(
      req,
      'ADMIN_UPDATE_POSTAL_CODE',
      'postal_codes',
      record.id,
      oldRecord,
      record,
    );
    sendSuccess(res, record);
  } catch (error) {
    next(error);
  }
}

export async function adminDeletePostalCode(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const oldRecord = await prisma.postalCode.findUnique({ where: { id: req.params.id } });
    await postalCodesService.deletePostalCode(req.params.id);
    await adminAuditService.recordAudit(
      req,
      'ADMIN_DELETE_POSTAL_CODE',
      'postal_codes',
      req.params.id,
      oldRecord,
      null,
    );
    sendNoContent(res);
  } catch (error) {
    next(error);
  }
}

// ==================== DATA SOURCES ADMIN ====================
export async function adminCreateDataSource(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const source = await dataSourcesService.createDataSource(req.body);
    await adminAuditService.recordAudit(
      req,
      'ADMIN_CREATE_DATA_SOURCE',
      'data_sources',
      source.id,
      null,
      source,
    );
    sendCreated(res, source);
  } catch (error) {
    next(error);
  }
}

export async function adminUpdateDataSource(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const oldSource = await dataSourcesService.getDataSourceById(req.params.id);
    const source = await dataSourcesService.updateDataSource(req.params.id, req.body);
    await adminAuditService.recordAudit(
      req,
      'ADMIN_UPDATE_DATA_SOURCE',
      'data_sources',
      source.id,
      oldSource,
      source,
    );
    sendSuccess(res, source);
  } catch (error) {
    next(error);
  }
}

export async function adminDeleteDataSource(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const oldSource = await dataSourcesService.getDataSourceById(req.params.id);
    await dataSourcesService.deleteDataSource(req.params.id);
    await adminAuditService.recordAudit(
      req,
      'ADMIN_DELETE_DATA_SOURCE',
      'data_sources',
      req.params.id,
      oldSource,
      null,
    );
    sendNoContent(res);
  } catch (error) {
    next(error);
  }
}

// ==================== USERS & ROLES ADMIN ====================
export async function adminListUsers(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const page = Math.max(1, parseInt(String(req.query.page || 1), 10));
    const limit = Math.min(Math.max(1, parseInt(String(req.query.limit || 20), 10)), 100);
    const skip = (page - 1) * limit;

    const [total, users] = await Promise.all([
      prisma.user.count(),
      prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        select: {
          id: true,
          email: true,
          first_name: true,
          last_name: true,
          is_active: true,
          role: { select: { id: true, name: true, description: true } },
          created_at: true,
          updated_at: true,
        },
      }),
    ]);

    sendCollection(res, users, { page, limit, total });
  } catch (error) {
    next(error);
  }
}

export async function adminCreateUser(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const {
      email,
      password,
      first_name,
      last_name,
      role_name = 'viewer',
      is_active = true,
    } = req.body;

    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) throw new ConflictError('User with this email already exists');

    const role = await prisma.role.findUnique({ where: { name: role_name } });
    if (!role) throw new NotFoundError(`Role "${role_name}"`);

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password_hash: passwordHash,
        first_name,
        last_name,
        role_id: role.id,
        is_active,
      },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        is_active: true,
        role: { select: { id: true, name: true } },
        created_at: true,
      },
    });

    await adminAuditService.recordAudit(req, 'ADMIN_CREATE_USER', 'users', user.id, null, user);
    sendCreated(res, user);
  } catch (error) {
    next(error);
  }
}

export async function adminUpdateUser(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { role_name, is_active, first_name, last_name, password } = req.body;
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!user) throw new NotFoundError('User');

    let role_id = user.role_id;
    if (role_name) {
      const role = await prisma.role.findUnique({ where: { name: role_name } });
      if (!role) throw new NotFoundError(`Role "${role_name}"`);
      role_id = role.id;
    }

    let password_hash = user.password_hash;
    if (password) {
      password_hash = await hashPassword(password);
    }

    const updated = await prisma.user.update({
      where: { id: req.params.id },
      data: {
        first_name: first_name !== undefined ? first_name : user.first_name,
        last_name: last_name !== undefined ? last_name : user.last_name,
        is_active: is_active !== undefined ? is_active : user.is_active,
        role_id,
        password_hash,
      },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        is_active: true,
        role: { select: { id: true, name: true } },
        updated_at: true,
      },
    });

    await adminAuditService.recordAudit(req, 'ADMIN_UPDATE_USER', 'users', user.id, user, updated);
    sendSuccess(res, updated);
  } catch (error) {
    next(error);
  }
}

export async function adminDeleteUser(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!user) throw new NotFoundError('User');

    await prisma.user.delete({ where: { id: req.params.id } });
    await adminAuditService.recordAudit(
      req,
      'ADMIN_DELETE_USER',
      'users',
      req.params.id,
      user,
      null,
    );
    sendNoContent(res);
  } catch (error) {
    next(error);
  }
}

// ==================== API KEYS ADMIN ====================
export async function adminListApiKeys(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const page = Math.max(1, parseInt(String(req.query.page || 1), 10));
    const limit = Math.min(Math.max(1, parseInt(String(req.query.limit || 20), 10)), 100);
    const skip = (page - 1) * limit;

    const [total, keys] = await Promise.all([
      prisma.apiKey.count(),
      prisma.apiKey.findMany({
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: {
          user: {
            select: { id: true, email: true, first_name: true, last_name: true },
          },
        },
      }),
    ]);

    sendCollection(res, keys, { page, limit, total });
  } catch (error) {
    next(error);
  }
}

export async function adminToggleApiKeyStatus(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const key = await prisma.apiKey.findUnique({ where: { id: req.params.id } });
    if (!key) throw new NotFoundError('API key');

    const updated = await prisma.apiKey.update({
      where: { id: req.params.id },
      data: { is_active: req.body.is_active !== undefined ? req.body.is_active : !key.is_active },
    });

    await adminAuditService.recordAudit(
      req,
      'ADMIN_TOGGLE_API_KEY',
      'api_keys',
      key.id,
      key,
      updated,
    );
    sendSuccess(res, updated);
  } catch (error) {
    next(error);
  }
}

export async function adminDeleteApiKey(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const key = await prisma.apiKey.findUnique({ where: { id: req.params.id } });
    if (!key) throw new NotFoundError('API key');

    await prisma.apiKey.delete({ where: { id: req.params.id } });
    await adminAuditService.recordAudit(
      req,
      'ADMIN_DELETE_API_KEY',
      'api_keys',
      req.params.id,
      key,
      null,
    );
    sendNoContent(res);
  } catch (error) {
    next(error);
  }
}

// ==================== AUDIT LOGS ADMIN ====================
export async function adminListAuditLogs(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = await adminAuditService.getAuditLogs({
      page: req.query.page ? parseInt(String(req.query.page), 10) : undefined,
      limit: req.query.limit ? parseInt(String(req.query.limit), 10) : undefined,
      action: req.query.action as string,
      resource: req.query.resource as string,
    });
    sendCollection(res, result.data, result.pagination);
  } catch (error) {
    next(error);
  }
}

// ==================== DATA IMPORTS ADMIN ====================
export async function adminListDataImports(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const imports = await dataImportService.listImports();
    sendSuccess(res, imports);
  } catch (error) {
    next(error);
  }
}

export async function adminCreateDataImport(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = await dataImportService.processImport({
      ...req.body,
      imported_by: req.user?.email || 'admin',
    });
    await adminAuditService.recordAudit(
      req,
      'ADMIN_DATA_IMPORT',
      req.body.resource_type,
      result.import.id,
      null,
      result,
    );
    sendCreated(res, result);
  } catch (error) {
    next(error);
  }
}

// ==================== DATA EXPORT ADMIN ====================
export async function adminExportData(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const resource = req.params.resource as
      'provinces' | 'districts' | 'communes' | 'villages' | 'postal-codes';
    const format = (req.query.format as 'json' | 'csv') || 'json';

    const result = await exportService.exportResource(resource, format);

    res.setHeader('Content-Type', result.contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);

    if (format === 'csv') {
      res.send(result.data);
    } else {
      res.json(result.data);
    }
  } catch (error) {
    next(error);
  }
}

// ==================== SYSTEM ADMIN ====================
export async function adminGetSystemStatus(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const [dbOk, redisOk] = await Promise.all([checkDatabaseConnection(), checkRedisConnection()]);

    const systemInfo = {
      service: 'KhmerAPI Gateway',
      environment: process.env.NODE_ENV || 'development',
      node_version: process.version,
      platform: process.platform,
      arch: process.arch,
      uptime_seconds: process.uptime(),
      memory_usage: process.memoryUsage(),
      cpu_count: os.cpus().length,
      free_memory_mb: Math.round(os.freemem() / 1024 / 1024),
      total_memory_mb: Math.round(os.totalmem() / 1024 / 1024),
      database: {
        status: dbOk ? 'connected' : 'disconnected',
        provider: 'PostgreSQL',
      },
      redis: {
        status: redisOk ? 'connected' : 'disconnected_or_disabled',
      },
      timestamp: new Date().toISOString(),
    };

    sendSuccess(res, systemInfo);
  } catch (error) {
    next(error);
  }
}
