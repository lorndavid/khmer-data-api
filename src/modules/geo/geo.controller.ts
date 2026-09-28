import { Request, Response, NextFunction } from 'express';
import { geoService } from './geo.service.js';
import { sendSuccess } from '../../common/utils/response.js';

export async function getGeoProvinces(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const data = await geoService.getGeoProvinces();
    sendSuccess(res, data);
  } catch (error) {
    next(error);
  }
}

export async function getGeoDistricts(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const provinceCode = req.query.province_code as string | undefined;
    const data = await geoService.getGeoDistricts(provinceCode);
    sendSuccess(res, data);
  } catch (error) {
    next(error);
  }
}

export async function getGeoCommunes(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const districtCode = req.query.district_code as string | undefined;
    const data = await geoService.getGeoCommunes(districtCode);
    sendSuccess(res, data);
  } catch (error) {
    next(error);
  }
}

export async function getGeoVillages(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const communeCode = req.query.commune_code as string | undefined;
    const data = await geoService.getGeoVillages(communeCode);
    sendSuccess(res, data);
  } catch (error) {
    next(error);
  }
}
