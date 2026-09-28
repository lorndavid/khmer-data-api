import { Request, Response, NextFunction } from 'express';
import { ForbiddenError, UnauthorizedError } from '../errors/index.js';
import { SystemRole, SystemPermission } from '../constants/roles.js';

export function requireRole(...allowedRoles: (SystemRole | string)[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentication required'));
    }

    const userRole = req.user.role.name;
    // super_admin always has access
    if (userRole === 'super_admin' || allowedRoles.includes(userRole)) {
      return next();
    }

    return next(
      new ForbiddenError(`Access denied. Requires one of roles: [${allowedRoles.join(', ')}]`),
    );
  };
}

export function requirePermission(...requiredPermissions: (SystemPermission | string)[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentication required'));
    }

    const userRole = req.user.role.name;
    // super_admin bypasses specific permission checks
    if (userRole === 'super_admin') {
      return next();
    }

    const userPermissions = new Set(req.user.role.permissions);
    const hasAll = requiredPermissions.every((perm) => userPermissions.has(perm));

    if (!hasAll) {
      return next(
        new ForbiddenError(
          `Access denied. Requires permissions: [${requiredPermissions.join(', ')}]`,
        ),
      );
    }

    return next();
  };
}
