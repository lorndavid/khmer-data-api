import { Request, Response, NextFunction } from 'express';
import { hashSha256 } from '../utils/crypto.js';
import { prisma } from '../../config/database.js';
import { UnauthorizedError } from '../errors/index.js';
import { ErrorCodes } from '../constants/error-codes.js';
import { AuthenticatedApiKey } from '../types/express.js';
import { logger } from '../../config/logger.js';

export async function authenticateApiKey(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const rawApiKey = (req.headers['x-api-key'] || req.query.apiKey) as string;

    if (!rawApiKey) {
      throw new UnauthorizedError(
        'API key missing. Provide X-API-Key header or apiKey parameter',
        ErrorCodes.INVALID_API_KEY,
      );
    }

    const keyHash = hashSha256(rawApiKey.trim());

    const apiKeyRecord = await prisma.apiKey.findUnique({
      where: { key_hash: keyHash },
    });

    if (!apiKeyRecord) {
      throw new UnauthorizedError('Invalid or unrecognized API key', ErrorCodes.INVALID_API_KEY);
    }

    if (!apiKeyRecord.is_active) {
      throw new UnauthorizedError('API key has been deactivated', ErrorCodes.INVALID_API_KEY);
    }

    if (apiKeyRecord.expires_at && apiKeyRecord.expires_at < new Date()) {
      throw new UnauthorizedError('API key has expired', ErrorCodes.INVALID_API_KEY);
    }

    // Attach to request
    const apiKeyInfo: AuthenticatedApiKey = {
      id: apiKeyRecord.id,
      user_id: apiKeyRecord.user_id,
      name: apiKeyRecord.name,
      key_prefix: apiKeyRecord.key_prefix,
      rate_limit: apiKeyRecord.rate_limit,
    };
    req.apiKey = apiKeyInfo;

    // Asynchronously update last_used_at
    prisma.apiKey
      .update({
        where: { id: apiKeyRecord.id },
        data: { last_used_at: new Date() },
      })
      .catch((err) => {
        logger.warn({ err, apiKeyId: apiKeyRecord.id }, 'Failed to update API key last_used_at');
      });

    next();
  } catch (error) {
    next(error);
  }
}

export async function optionalApiKey(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  const rawApiKey = (req.headers['x-api-key'] || req.query.apiKey) as string;
  if (!rawApiKey) {
    return next();
  }

  try {
    const keyHash = hashSha256(rawApiKey.trim());
    const apiKeyRecord = await prisma.apiKey.findUnique({
      where: { key_hash: keyHash },
    });

    if (
      apiKeyRecord &&
      apiKeyRecord.is_active &&
      (!apiKeyRecord.expires_at || apiKeyRecord.expires_at >= new Date())
    ) {
      req.apiKey = {
        id: apiKeyRecord.id,
        user_id: apiKeyRecord.user_id,
        name: apiKeyRecord.name,
        key_prefix: apiKeyRecord.key_prefix,
        rate_limit: apiKeyRecord.rate_limit,
      };

      prisma.apiKey
        .update({
          where: { id: apiKeyRecord.id },
          data: { last_used_at: new Date() },
        })
        .catch(() => {});
    }
    next();
  } catch {
    next();
  }
}
