import { Request, Response, NextFunction } from 'express';
import { demographicsService } from './demographics.service.js';

export class DemographicsController {
  async getPopulation(req: Request, res: Response, next: NextFunction) {
    try {
      const from = req.query.from ? parseInt(String(req.query.from), 10) : undefined;
      const to = req.query.to ? parseInt(String(req.query.to), 10) : undefined;

      const data = await demographicsService.getPopulationData({ from, to });

      return res.json({
        success: true,
        data,
        meta: {
          request_id: req.id,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (err) {
      return next(err);
    }
  }
}

export const demographicsController = new DemographicsController();
