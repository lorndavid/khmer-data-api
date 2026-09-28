import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { UnauthorizedError } from '../errors/index.js';
import { ErrorCodes } from '../constants/error-codes.js';

export interface JwtTokenPayload {
  userId: string;
  email: string;
  roleId: string;
  roleName: string;
  [key: string]: unknown;
}

export function signAccessToken(payload: JwtTokenPayload): string {
  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as unknown as number,
  };
  return jwt.sign(payload, env.JWT_SECRET, options);
}

export function signRefreshToken(payload: { userId: string }): string {
  const options: SignOptions = {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as unknown as number,
  };
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, options);
}

export function verifyAccessToken(token: string): JwtTokenPayload {
  try {
    return jwt.verify(token, env.JWT_SECRET) as JwtTokenPayload;
  } catch (err: unknown) {
    if (err instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError('Access token has expired', ErrorCodes.TOKEN_EXPIRED);
    }
    throw new UnauthorizedError('Invalid access token', ErrorCodes.INVALID_TOKEN);
  }
}

export function verifyRefreshToken(token: string): { userId: string; exp?: number } {
  try {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as { userId: string; exp?: number };
  } catch (err: unknown) {
    if (err instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError('Refresh token has expired', ErrorCodes.TOKEN_EXPIRED);
    }
    throw new UnauthorizedError('Invalid refresh token', ErrorCodes.INVALID_TOKEN);
  }
}
