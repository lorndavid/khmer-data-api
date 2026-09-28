import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { redisCache } from '../../config/redis.js';
import { parsePagination } from '../../common/utils/pagination.js';
import { slugify } from '../../common/utils/slugify.js';
import { NotFoundError } from '../../common/errors/index.js';
import { ListCommunesQuery, CreateCommuneInput, UpdateCommuneInput } from './communes.schema.js';

export class CommunesService {
  async listCommunes(query: ListCommunesQuery) {
    const { page, limit, skip, take, sort, order } = parsePagination(
      {
        page: query.page,
        limit: query.limit,
        sort: query.sort,
        order: query.order as 'asc' | 'desc',
      },
      'code',
      'asc',
    );

    const cacheKey = `communes:list:${page}:${limit}:${query.district_code || ''}:${query.district_id || ''}:${query.province_code || ''}:${query.search || ''}:${query.type || ''}:${sort}:${order}:${query.active}`;
    const cached = await redisCache.get<{
      data: unknown[];
      pagination: { page: number; limit: number; total: number };
    }>(cacheKey);
    if (cached) return cached;

    const where: Prisma.CommuneWhereInput = {};

    if (query.active !== undefined) {
      where.is_active = query.active;
    }

    if (query.type) {
      where.type = { equals: query.type, mode: 'insensitive' };
    }

    if (query.district_id) {
      where.district_id = query.district_id;
    }

    if (query.district_code) {
      where.district = { code: query.district_code };
    }

    if (query.province_code) {
      where.district = { province: { code: query.province_code } };
    }

    if (query.search && query.search.trim()) {
      const searchTerm = query.search.trim();
      where.OR = [
        { code: { contains: searchTerm, mode: 'insensitive' } },
        { name_km: { contains: searchTerm, mode: 'insensitive' } },
        { name_en: { contains: searchTerm, mode: 'insensitive' } },
        { slug: { contains: searchTerm.toLowerCase(), mode: 'insensitive' } },
      ];
    }

    const [total, communes] = await Promise.all([
      prisma.commune.count({ where }),
      prisma.commune.findMany({
        where,
        skip,
        take,
        orderBy: { [sort]: order },
        select: {
          id: true,
          code: true,
          district_id: true,
          district: {
            select: {
              id: true,
              code: true,
              name_km: true,
              name_en: true,
              slug: true,
              province: {
                select: {
                  id: true,
                  code: true,
                  name_km: true,
                  name_en: true,
                  slug: true,
                },
              },
            },
          },
          name_km: true,
          name_en: true,
          slug: true,
          type: true,
          latitude: true,
          longitude: true,
          is_active: true,
          created_at: true,
          updated_at: true,
          _count: {
            select: {
              villages: true,
              postal_codes: true,
            },
          },
        },
      }),
    ]);

    const result = {
      data: communes,
      pagination: {
        page,
        limit,
        total,
      },
    };

    await redisCache.set(cacheKey, result, 3600);
    return result;
  }

  async getCommuneByCode(codeOrSlug: string) {
    const cacheKey = `commune:${codeOrSlug}`;
    const cached = await redisCache.get(cacheKey);
    if (cached) return cached;

    const commune = await prisma.commune.findFirst({
      where: {
        OR: [{ code: codeOrSlug }, { slug: codeOrSlug.toLowerCase() }, { id: codeOrSlug }],
      },
      include: {
        district: {
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
          },
        },
        _count: {
          select: {
            villages: true,
            postal_codes: true,
          },
        },
      },
    });

    if (!commune) {
      throw new NotFoundError('Commune');
    }

    await redisCache.set(cacheKey, commune, 3600);
    return commune;
  }

  async getCommuneVillages(codeOrSlug: string) {
    const cacheKey = `commune:${codeOrSlug}:villages`;
    const cached = await redisCache.get(cacheKey);
    if (cached) return cached;

    const commune = await prisma.commune.findFirst({
      where: {
        OR: [{ code: codeOrSlug }, { slug: codeOrSlug.toLowerCase() }, { id: codeOrSlug }],
      },
      include: {
        district: {
          include: {
            province: {
              select: {
                id: true,
                code: true,
                name_km: true,
                name_en: true,
              },
            },
          },
        },
      },
    });

    if (!commune) {
      throw new NotFoundError('Commune');
    }

    const villages = await prisma.village.findMany({
      where: { commune_id: commune.id, is_active: true },
      orderBy: { code: 'asc' },
      select: {
        id: true,
        code: true,
        commune_id: true,
        name_km: true,
        name_en: true,
        slug: true,
        latitude: true,
        longitude: true,
        is_active: true,
      },
    });

    const result = {
      commune: {
        id: commune.id,
        code: commune.code,
        name_km: commune.name_km,
        name_en: commune.name_en,
        slug: commune.slug,
        district: commune.district,
      },
      villages,
    };

    await redisCache.set(cacheKey, result, 3600);
    return result;
  }

  // Admin Mutations
  async createCommune(data: CreateCommuneInput) {
    const slug = data.slug || slugify(data.name_en);

    const commune = await prisma.commune.create({
      data: {
        code: data.code,
        district_id: data.district_id,
        name_km: data.name_km,
        name_en: data.name_en,
        slug,
        type: data.type || 'Commune',
        latitude: data.latitude,
        longitude: data.longitude,
        is_active: data.is_active ?? true,
      },
    });

    await this.invalidateCache(commune.code);
    return commune;
  }

  async updateCommune(idOrCode: string, data: UpdateCommuneInput) {
    const existing = await prisma.commune.findFirst({
      where: { OR: [{ id: idOrCode }, { code: idOrCode }] },
    });

    if (!existing) {
      throw new NotFoundError('Commune');
    }

    const slug = data.slug || (data.name_en ? slugify(data.name_en) : undefined);

    const updated = await prisma.commune.update({
      where: { id: existing.id },
      data: {
        ...data,
        slug: slug !== undefined ? slug : existing.slug,
      },
    });

    await this.invalidateCache(existing.code);
    return updated;
  }

  async deleteCommune(idOrCode: string) {
    const existing = await prisma.commune.findFirst({
      where: { OR: [{ id: idOrCode }, { code: idOrCode }] },
    });

    if (!existing) {
      throw new NotFoundError('Commune');
    }

    await prisma.commune.delete({
      where: { id: existing.id },
    });

    await this.invalidateCache(existing.code);
  }

  async invalidateCache(code?: string) {
    await redisCache.delByPattern('communes:*');
    await redisCache.delByPattern('districts:*');
    await redisCache.delByPattern('provinces:*');
    await redisCache.delByPattern('locations:*');
    await redisCache.delByPattern('statistics:*');
    if (code) {
      await redisCache.del(`commune:${code}`);
      await redisCache.del(`commune:${code}:villages`);
    }
  }
}

export const communesService = new CommunesService();
