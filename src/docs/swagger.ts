import { Router, Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import { openApiDocument } from './openapi.js';

const router = Router();

// Serve OpenAPI 3.1 JSON
router.get('/openapi.json', (_req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.json(openApiDocument);
});

// Serve Swagger UI
router.use('/', swaggerUi.serve);
router.get(
  '/',
  swaggerUi.setup(openApiDocument, {
    customSiteTitle: 'KhmerAPI Documentation',
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info { margin: 20px 0; }
      .swagger-ui .info .title { font-family: system-ui, -apple-system, sans-serif; font-size: 28px; }
    `,
  }),
);

export const docsRouter = router;
