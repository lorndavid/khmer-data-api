import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { redisCache } from '../../config/redis.js';
import { parsePagination } from '../../common/utils/pagination.js';
import { NotFoundError } from '../../common/errors/index.js';
import {
  ListPostalCodesQuery,
  CreatePostalCodeInput,
  UpdatePostalCodeInput,
} from './postal-codes.schema.js';

export class PostalCodesService {
  async listPostalCodes(query: ListPostalCodesQuery) {
    const { page, limit, skip, take, sort, order } = parsePagination(
      {
        page: query.page,
        limit: query.limit,
        sort: query.sort,
        order: query.order as 'asc' | 'desc',
      },
      'postal_code',
      'asc',
    );

    const cacheKey = `postalcodes:list:${page}:${limit}:${query.postal_code || ''}:${query.province_code || ''}:${query.district_code || ''}:${query.commune_code || ''}:${query.search || ''}:${sort}:${order}:${query.active}`;
    const cached = await redisCache.get<{
      data: unknown[];
      pagination: { page: number; limit: number; total: number };
    }>(cacheKey);
    if (cached) return cached;

    const where: Prisma.PostalCodeWhereInput = {};

    if (query.active !== undefined) {
      where.is_active = query.active;
    }

    if (query.postal_code) {
      where.postal_code = { contains: query.postal_code.trim() };
    }

    if (query.province_code) {
      where.province = { code: query.province_code };
    }

    if (query.district_code) {
      where.district = { code: query.district_code };
    }

    if (query.commune_code) {
      where.commune = { code: query.commune_code };
    }

    if (query.search && query.search.trim()) {
      const searchTerm = query.search.trim();
      where.OR = [
        { postal_code: { contains: searchTerm } },
        { province: { name_km: { contains: searchTerm, mode: 'insensitive' } } },
        { province: { name_en: { contains: searchTerm, mode: 'insensitive' } } },
        { district: { name_km: { contains: searchTerm, mode: 'insensitive' } } },
        { district: { name_en: { contains: searchTerm, mode: 'insensitive' } } },
        { commune: { name_km: { contains: searchTerm, mode: 'insensitive' } } },
        { commune: { name_en: { contains: searchTerm, mode: 'insensitive' } } },
      ];
    }

    const [total, postalCodes] = await Promise.all([
      prisma.postalCode.count({ where }),
      prisma.postalCode.findMany({
        where,
        skip,
        take,
        orderBy: { [sort]: order },
        select: {
          id: true,
          postal_code: true,
          is_active: true,
          created_at: true,
          updated_at: true,
          province: {
            select: {
              id: true,
              code: true,
              name_km: true,
              name_en: true,
              slug: true,
            },
          },
          district: {
            select: {
              id: true,
              code: true,
              name_km: true,
              name_en: true,
              slug: true,
            },
          },
          commune: {
            select: {
              id: true,
              code: true,
              name_km: true,
              name_en: true,
              slug: true,
            },
          },
        },
      }),
    ]);

    const result = {
      data: postalCodes,
      pagination: {
        page,
        limit,
        total,
      },
    };

    await redisCache.set(cacheKey, result, 3600);
    return result;
  }

  async getPostalCode(code: string) {
    const cacheKey = `postalcode:${code}`;
    const cached = await redisCache.get(cacheKey);
    if (cached) return cached;

    const postalCodes = await prisma.postalCode.findMany({
      where: { postal_code: code },
      include: {
        province: {
          select: {
            id: true,
            code: true,
            name_km: true,
            name_en: true,
            slug: true,
          },
        },
        district: {
          select: {
            id: true,
            code: true,
            name_km: true,
            name_en: true,
            slug: true,
          },
        },
        commune: {
          select: {
            id: true,
            code: true,
            name_km: true,
            name_en: true,
            slug: true,
          },
        },
      },
    });

    if (!postalCodes || postalCodes.length === 0) {
      throw new NotFoundError('Postal code');
    }

    const result = {
      postal_code: code,
      count: postalCodes.length,
      locations: postalCodes,
    };

    await redisCache.set(cacheKey, result, 3600);
    return result;
  }

  // Admin Mutations
  async createPostalCode(data: CreatePostalCodeInput) {
    const record = await prisma.postalCode.create({
      data: {
        postal_code: data.postal_code,
        province_id: data.province_id,
        district_id: data.district_id,
        commune_id: data.commune_id,
        is_active: data.is_active ?? true,
      },
    });

    await this.invalidateCache(record.postal_code);
    return record;
  }

  async updatePostalCode(id: string, data: UpdatePostalCodeInput) {
    const existing = await prisma.postalCode.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundError('Postal code');
    }

    const updated = await prisma.postalCode.update({
      where: { id },
      data,
    });

    await this.invalidateCache(existing.postal_code);
    return updated;
  }

  async deletePostalCode(id: string) {
    const existing = await prisma.postalCode.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundError('Postal code');
    }

    await prisma.postalCode.delete({
      where: { id },
    });

    await this.invalidateCache(existing.postal_code);
  }

  async invalidateCache(code?: string) {
    await redisCache.delByPattern('postalcodes:*');
    await redisCache.delByPattern('locations:*');
    await redisCache.delByPattern('statistics:*');
    if (code) {
      await redisCache.del(`postalcode:${code}`);
    }
  }
}

export const postalCodesService = new PostalCodesService();
