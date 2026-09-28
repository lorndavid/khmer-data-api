import { prisma } from '../../config/database.js';
import { NotFoundError } from '../../common/errors/index.js';

export class DataSourcesService {
  async listDataSources() {
    return prisma.dataSource.findMany({
      orderBy: { created_at: 'asc' },
    });
  }

  async getDataSourceById(id: string) {
    const source = await prisma.dataSource.findUnique({
      where: { id },
    });

    if (!source) {
      throw new NotFoundError('Data source');
    }

    return source;
  }

  async createDataSource(data: {
    name: string;
    organization: string;
    url: string;
    license: string;
    description?: string;
    last_verified_at?: Date;
  }) {
    return prisma.dataSource.create({
      data,
    });
  }

  async updateDataSource(
    id: string,
    data: Partial<{
      name: string;
      organization: string;
      url: string;
      license: string;
      description?: string;
      last_verified_at?: Date;
    }>,
  ) {
    const existing = await prisma.dataSource.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError('Data source');

    return prisma.dataSource.update({
      where: { id },
      data,
    });
  }

  async deleteDataSource(id: string) {
    const existing = await prisma.dataSource.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError('Data source');

    await prisma.dataSource.delete({ where: { id } });
  }
}

export const dataSourcesService = new DataSourcesService();
