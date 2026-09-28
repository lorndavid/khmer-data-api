import { Request, Response, NextFunction } from 'express';
import { provincesService } from './provinces.service.js';
import { sendCollection, sendSuccess } from '../../common/utils/response.js';

export async function listProvinces(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = await provincesService.listProvinces(req.query);
    sendCollection(res, result.data, result.pagination);
  } catch (error) {
    next(error);
  }
}

export async function getProvinceByCode(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const province = await provincesService.getProvinceByCode(req.params.code);
    sendSuccess(res, province);
  } catch (error) {
    next(error);
  }
}

export async function getProvinceDistricts(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = await provincesService.getProvinceDistricts(
      req.params.code || req.params.provinceCode,
    );
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}
