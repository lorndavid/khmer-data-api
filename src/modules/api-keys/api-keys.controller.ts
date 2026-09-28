import { Request, Response, NextFunction } from 'express';
import { apiKeyService } from './api-keys.service.js';
import { sendCreated, sendSuccess, sendNoContent } from '../../common/utils/response.js';

export async function createApiKey(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await apiKeyService.createApiKey(req.user!.id, req.body);
    sendCreated(res, result);
  } catch (error) {
    next(error);
  }
}

export async function listApiKeys(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const keys = await apiKeyService.getUserApiKeys(req.user!.id);
    sendSuccess(res, keys);
  } catch (error) {
    next(error);
  }
}

export async function deleteApiKey(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await apiKeyService.deleteApiKey(req.user!.id, req.params.id);
    sendNoContent(res);
  } catch (error) {
    next(error);
  }
}
