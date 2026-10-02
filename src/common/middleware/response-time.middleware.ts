import { Request, Response, NextFunction } from 'express';

export function responseTimeMiddleware() {
  return (_req: Request, res: Response, next: NextFunction): void => {
    const start = performance.now();
    const originalJson = res.json.bind(res);

    res.json = (body: any) => {
      const duration = Math.max(1, Math.round(performance.now() - start));
      if (!res.headersSent) {
        res.setHeader('X-Response-Time', `${duration}ms`);
      }
      return originalJson(body);
    };

    next();
  };
}
