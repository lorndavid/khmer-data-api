import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function hashSha256(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

export interface GeneratedApiKey {
  rawKey: string;
  prefix: string;
  hash: string;
}

export function generateApiKey(prefix = 'kh_live'): GeneratedApiKey {
  const randomBytes = crypto.randomBytes(24).toString('hex');
  const rawKey = `${prefix}_${randomBytes}`;
  const keyPrefix = `${prefix}_${randomBytes.substring(0, 6)}`;
  const hash = hashSha256(rawKey);

  return {
    rawKey,
    prefix: keyPrefix,
    hash,
  };
}

export function generateRandomToken(): string {
  return crypto.randomBytes(32).toString('hex');
}
