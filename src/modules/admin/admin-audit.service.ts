import { Request } from 'express';
import { prisma } from '../../config/database.js';
import { logger } from '../../config/logger.js';
import { Prisma } from '@prisma/client';

export class AdminAuditService {
  async recordAudit(
    req: Request,
    action: string,
    resource: string,
    resourceId?: string,
    oldValue?: unknown,
    newValue?: unknown,
  ): Promise<void> {
    try {
      const rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
      const ipAddress = Array.isArray(rawIp) ? rawIp[0] : rawIp.split(',')[0].trim();
      const userAgent = req.headers['user-agent'] || null;

      await prisma.auditLog.create({
        data: {
          user_id: req.user?.id || null,
          action,
          resource,
          resource_id: resourceId || null,
          old_value: oldValue !== undefined ? (oldValue as Prisma.InputJsonValue) : Prisma.DbNull,
          new_value: newValue !== undefined ? (newValue as Prisma.InputJsonValue) : Prisma.DbNull,
          ip_address: ipAddress,
          user_agent: userAgent,
        },
      });
    } catch (err) {
      logger.warn({ err, action, resource }, 'Failed to write audit log');
    }
  }

  async getAuditLogs(params: {
    page?: number;
    limit?: number;
    action?: string;
    resource?: string;
  }) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(Math.max(1, params.limit || 20), 100);
    const skip = (page - 1) * limit;

    const where: Prisma.AuditLogWhereInput = {};
    if (params.action) where.action = { contains: params.action, mode: 'insensitive' };
    if (params.resource) where.resource = params.resource;

    const [total, logs] = await Promise.all([
      prisma.auditLog.count({ where }),
      prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              first_name: true,
              last_name: true,
            },
          },
        },
      }),
    ]);

    return {
      data: logs,
      pagination: {
        page,
        limit,
        total,
      },
    };
  }
}

export const adminAuditService = new AdminAuditService();
