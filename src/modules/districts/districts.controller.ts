import { Request, Response, NextFunction } from 'express';
import { districtsService } from './districts.service.js';
import { sendCollection, sendSuccess } from '../../common/utils/response.js';
import { ListDistrictsQuery } from './districts.schema.js';

export async function listDistricts(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const rawQuery = req.query as unknown as ListDistrictsQuery;
    const query: ListDistrictsQuery = {
      ...rawQuery,
      province_code: (req.params.provinceCode as string) || rawQuery.province_code,
    };
    const result = await districtsService.listDistricts(query);
    sendCollection(res, result.data, result.pagination);
  } catch (error) {
    next(error);
  }
}

export async function getDistrictByCode(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const district = await districtsService.getDistrictByCode(req.params.code);
    sendSuccess(res, district);
  } catch (error) {
    next(error);
  }
}

export async function getDistrictCommunes(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const code = req.params.code || req.params.districtCode;
    const result = await districtsService.getDistrictCommunes(code);
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}
