import { prisma } from '../../config/database.js';
import { generateApiKey } from '../../common/utils/crypto.js';
import { NotFoundError } from '../../common/errors/index.js';
import { CreateApiKeyInput } from './api-keys.schema.js';
import { env } from '../../config/env.js';

export class ApiKeyService {
  async createApiKey(
    userId: string,
    data: CreateApiKeyInput,
  ): Promise<{ apiKey: unknown; rawKey: string }> {
    const { rawKey, prefix, hash } = generateApiKey('kh_live');

    let expiresAt: Date | undefined;
    if (data.expires_in_days) {
      expiresAt = new Date(Date.now() + data.expires_in_days * 24 * 60 * 60 * 1000);
    }

    const apiKey = await prisma.apiKey.create({
      data: {
        user_id: userId,
        name: data.name,
        key_prefix: prefix,
        key_hash: hash,
        rate_limit: env.RATE_LIMIT_DEVELOPER,
        expires_at: expiresAt,
      },
      select: {
        id: true,
        name: true,
        key_prefix: true,
        rate_limit: true,
        last_used_at: true,
        expires_at: true,
        is_active: true,
        created_at: true,
      },
    });

    return {
      apiKey,
      rawKey, // Returned only once!
    };
  }

  async getUserApiKeys(userId: string): Promise<unknown[]> {
    return prisma.apiKey.findMany({
      where: { user_id: userId },
      select: {
        id: true,
        name: true,
        key_prefix: true,
        rate_limit: true,
        last_used_at: true,
        expires_at: true,
        is_active: true,
        created_at: true,
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async revokeApiKey(userId: string, keyId: string): Promise<void> {
    const key = await prisma.apiKey.findFirst({
      where: { id: keyId, user_id: userId },
    });

    if (!key) {
      throw new NotFoundError('API key');
    }

    await prisma.apiKey.update({
      where: { id: keyId },
      data: { is_active: false },
    });
  }

  async deleteApiKey(userId: string, keyId: string): Promise<void> {
    const key = await prisma.apiKey.findFirst({
      where: { id: keyId, user_id: userId },
    });

    if (!key) {
      throw new NotFoundError('API key');
    }

    await prisma.apiKey.delete({
      where: { id: keyId },
    });
  }
}

export const apiKeyService = new ApiKeyService();
