import { prisma } from '../../config/database.js';
import { slugify } from '../../common/utils/slugify.js';
import { BadRequestError } from '../../common/errors/index.js';
import { redisCache } from '../../config/redis.js';

export interface ImportRecordPayload {
  resource_type: 'provinces' | 'districts' | 'communes' | 'villages' | 'postal_codes' | 'all';
  file_name?: string;
  format?: 'json' | 'csv';
  data: Record<string, unknown>[];
  imported_by?: string;
}

export class DataImportService {
  async listImports() {
    return prisma.dataImport.findMany({
      orderBy: { created_at: 'desc' },
      take: 50,
    });
  }

  async processImport(payload: ImportRecordPayload) {
    const { resource_type, data, file_name = 'api_direct_import.json', imported_by } = payload;

    if (!Array.isArray(data) || data.length === 0) {
      throw new BadRequestError('Import payload must contain a non-empty array of data records');
    }

    // 1. Create DataImport record
    const importRecord = await prisma.dataImport.create({
      data: {
        file_name,
        file_type: payload.format || 'json',
        resource_type,
        status: 'PROCESSING',
        total_records: data.length,
        imported_by,
      },
    });

    try {
      let successCount = 0;
      const errors: { index: number; code?: string; error: string }[] = [];

      // Execute in a single transactional database session
      await prisma.$transaction(
        async (tx) => {
          for (let i = 0; i < data.length; i++) {
            const row = data[i];

            try {
              if (resource_type === 'provinces') {
                const code = String(row.code || '').trim();
                const name_km = String(row.name_km || '').trim();
                const name_en = String(row.name_en || '').trim();

                if (!code || !name_km || !name_en) {
                  throw new Error(`Row ${i + 1}: Missing required fields (code, name_km, name_en)`);
                }

                await tx.province.upsert({
                  where: { code },
                  update: {
                    name_km,
                    name_en,
                    slug: String(row.slug || slugify(name_en)),
                    type: String(row.type || 'Province'),
                    latitude: row.latitude ? Number(row.latitude) : null,
                    longitude: row.longitude ? Number(row.longitude) : null,
                    is_active: row.is_active !== undefined ? Boolean(row.is_active) : true,
                  },
                  create: {
                    code,
                    name_km,
                    name_en,
                    slug: String(row.slug || slugify(name_en)),
                    type: String(row.type || 'Province'),
                    latitude: row.latitude ? Number(row.latitude) : null,
                    longitude: row.longitude ? Number(row.longitude) : null,
                    is_active: row.is_active !== undefined ? Boolean(row.is_active) : true,
                  },
                });
                successCount++;
              } else if (resource_type === 'districts') {
                const code = String(row.code || '').trim();
                const province_code = String(row.province_code || '').trim();
                const name_km = String(row.name_km || '').trim();
                const name_en = String(row.name_en || '').trim();

                if (!code || !province_code || !name_km || !name_en) {
                  throw new Error(
                    `Row ${i + 1}: Missing required fields (code, province_code, name_km, name_en)`,
                  );
                }

                const province = await tx.province.findFirst({ where: { code: province_code } });
                if (!province) {
                  throw new Error(
                    `Row ${i + 1}: Referenced province_code "${province_code}" does not exist`,
                  );
                }

                await tx.district.upsert({
                  where: { code },
                  update: {
                    province_id: province.id,
                    name_km,
                    name_en,
                    slug: String(row.slug || slugify(name_en)),
                    type: String(row.type || 'District'),
                    latitude: row.latitude ? Number(row.latitude) : null,
                    longitude: row.longitude ? Number(row.longitude) : null,
                    is_active: row.is_active !== undefined ? Boolean(row.is_active) : true,
                  },
                  create: {
                    code,
                    province_id: province.id,
                    name_km,
                    name_en,
                    slug: String(row.slug || slugify(name_en)),
                    type: String(row.type || 'District'),
                    latitude: row.latitude ? Number(row.latitude) : null,
                    longitude: row.longitude ? Number(row.longitude) : null,
                    is_active: row.is_active !== undefined ? Boolean(row.is_active) : true,
                  },
                });
                successCount++;
              } else if (resource_type === 'communes') {
                const code = String(row.code || '').trim();
                const district_code = String(row.district_code || '').trim();
                const name_km = String(row.name_km || '').trim();
                const name_en = String(row.name_en || '').trim();

                if (!code || !district_code || !name_km || !name_en) {
                  throw new Error(
                    `Row ${i + 1}: Missing required fields (code, district_code, name_km, name_en)`,
                  );
                }

                const district = await tx.district.findFirst({ where: { code: district_code } });
                if (!district) {
                  throw new Error(
                    `Row ${i + 1}: Referenced district_code "${district_code}" does not exist`,
                  );
                }

                await tx.commune.upsert({
                  where: { code },
                  update: {
                    district_id: district.id,
                    name_km,
                    name_en,
                    slug: String(row.slug || slugify(name_en)),
                    type: String(row.type || 'Commune'),
                    latitude: row.latitude ? Number(row.latitude) : null,
                    longitude: row.longitude ? Number(row.longitude) : null,
                    is_active: row.is_active !== undefined ? Boolean(row.is_active) : true,
                  },
                  create: {
                    code,
                    district_id: district.id,
                    name_km,
                    name_en,
                    slug: String(row.slug || slugify(name_en)),
                    type: String(row.type || 'Commune'),
                    latitude: row.latitude ? Number(row.latitude) : null,
                    longitude: row.longitude ? Number(row.longitude) : null,
                    is_active: row.is_active !== undefined ? Boolean(row.is_active) : true,
                  },
                });
                successCount++;
              } else if (resource_type === 'villages') {
                const code = String(row.code || '').trim();
                const commune_code = String(row.commune_code || '').trim();
                const name_km = String(row.name_km || '').trim();
                const name_en = String(row.name_en || '').trim();

                if (!code || !commune_code || !name_km || !name_en) {
                  throw new Error(
                    `Row ${i + 1}: Missing required fields (code, commune_code, name_km, name_en)`,
                  );
                }

                const commune = await tx.commune.findFirst({ where: { code: commune_code } });
                if (!commune) {
                  throw new Error(
                    `Row ${i + 1}: Referenced commune_code "${commune_code}" does not exist`,
                  );
                }

                await tx.village.upsert({
                  where: { code },
                  update: {
                    commune_id: commune.id,
                    name_km,
                    name_en,
                    slug: String(row.slug || slugify(name_en)),
                    latitude: row.latitude ? Number(row.latitude) : null,
                    longitude: row.longitude ? Number(row.longitude) : null,
                    is_active: row.is_active !== undefined ? Boolean(row.is_active) : true,
                  },
                  create: {
                    code,
                    commune_id: commune.id,
                    name_km,
                    name_en,
                    slug: String(row.slug || slugify(name_en)),
                    latitude: row.latitude ? Number(row.latitude) : null,
                    longitude: row.longitude ? Number(row.longitude) : null,
                    is_active: row.is_active !== undefined ? Boolean(row.is_active) : true,
                  },
                });
                successCount++;
              } else if (resource_type === 'postal_codes') {
                const postal_code = String(row.postal_code || '').trim();
                const province_code = String(row.province_code || '').trim();

                if (!postal_code || !province_code) {
                  throw new Error(
                    `Row ${i + 1}: Missing required fields (postal_code, province_code)`,
                  );
                }

                const province = await tx.province.findFirst({ where: { code: province_code } });
                if (!province) {
                  throw new Error(
                    `Row ${i + 1}: Referenced province_code "${province_code}" does not exist`,
                  );
                }

                let district_id: string | null = null;
                if (row.district_code) {
                  const district = await tx.district.findFirst({
                    where: { code: String(row.district_code).trim() },
                  });
                  district_id = district?.id || null;
                }

                let commune_id: string | null = null;
                if (row.commune_code) {
                  const commune = await tx.commune.findFirst({
                    where: { code: String(row.commune_code).trim() },
                  });
                  commune_id = commune?.id || null;
                }

                await tx.postalCode.create({
                  data: {
                    postal_code,
                    province_id: province.id,
                    district_id,
                    commune_id,
                    is_active: row.is_active !== undefined ? Boolean(row.is_active) : true,
                  },
                });
                successCount++;
              } else {
                throw new Error(`Unsupported resource_type: ${resource_type}`);
              }
            } catch (rowErr: unknown) {
              const errorMessage = rowErr instanceof Error ? rowErr.message : String(rowErr);
              errors.push({
                index: i,
                code: (row.code as string) || (row.postal_code as string),
                error: errorMessage,
              });
              // Abort transaction on validation/relationship error to ensure zero data corruption
              throw new Error(`Import aborted due to error at record index ${i}: ${errorMessage}`);
            }
          }
        },
        { timeout: 60000 },
      );

      // Invalidate cache
      await redisCache.flushAll();

      const updated = await prisma.dataImport.update({
        where: { id: importRecord.id },
        data: {
          status: 'COMPLETED',
          success_records: successCount,
          failed_records: 0,
        },
      });

      return {
        import: updated,
        success: true,
        total_processed: successCount,
      };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);

      await prisma.dataImport.update({
        where: { id: importRecord.id },
        data: {
          status: 'FAILED',
          failed_records: data.length,
          error_log: { message: errorMessage },
        },
      });

      throw new BadRequestError(`Data import failed and rolled back: ${errorMessage}`);
    }
  }
}

export const dataImportService = new DataImportService();
