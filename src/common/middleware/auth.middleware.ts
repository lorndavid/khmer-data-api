import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.js';
import { prisma } from '../../config/database.js';
import { UnauthorizedError } from '../errors/index.js';
import { ErrorCodes } from '../constants/error-codes.js';
import { AuthenticatedUser } from '../types/express.js';

export async function authenticateJwt(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError(
        'Authorization header missing or invalid format (Bearer token required)',
      );
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedError('Token not found in authorization header');
    }

    const payload = verifyAccessToken(token);

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedError('User account not found', ErrorCodes.UNAUTHORIZED);
    }

    if (!user.is_active) {
      throw new UnauthorizedError('User account has been deactivated', ErrorCodes.UNAUTHORIZED);
    }

    const permissions = user.role.permissions.map((rp) => rp.permission.code);

    const authenticatedUser: AuthenticatedUser = {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role: {
        id: user.role.id,
        name: user.role.name,
        permissions,
      },
    };

    req.user = authenticatedUser;
    next();
  } catch (error) {
    next(error);
  }
}

export async function optionalAuth(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  try {
    const token = authHeader.split(' ')[1];
    if (!token) return next();

    const payload = verifyAccessToken(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    if (user && user.is_active) {
      const permissions = user.role.permissions.map((rp) => rp.permission.code);
      req.user = {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: {
          id: user.role.id,
          name: user.role.name,
          permissions,
        },
      };
    }
    next();
  } catch {
    // For optional auth, continue as anonymous if token is expired/invalid
    next();
  }
}
