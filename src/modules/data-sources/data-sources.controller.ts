import { Request, Response, NextFunction } from 'express';
import { dataSourcesService } from './data-sources.service.js';
import { sendSuccess } from '../../common/utils/response.js';

export async function listDataSources(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const sources = await dataSourcesService.listDataSources();
    sendSuccess(res, sources);
  } catch (error) {
    next(error);
  }
}

export async function getDataSourceById(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const source = await dataSourcesService.getDataSourceById(req.params.id);
    sendSuccess(res, source);
  } catch (error) {
    next(error);
  }
}
