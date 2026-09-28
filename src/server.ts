import { createApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { disconnectDatabase, checkDatabaseConnection } from './config/database.js';
import { disconnectRedis } from './config/redis.js';

async function startServer(): Promise<void> {
  try {
    const app = createApp();

    // Verify initial database connection
    const dbConnected = await checkDatabaseConnection();
    if (!dbConnected && env.NODE_ENV === 'production') {
      logger.fatal('Cannot start production server without PostgreSQL database connection');
      process.exit(1);
    }

    const server = app.listen(env.PORT, env.HOST, () => {
      logger.info(`=============================================================`);
      logger.info(`🇰🇭 KhmerAPI Gateway running at http://${env.HOST}:${env.PORT}`);
      logger.info(`📖 Swagger UI Documentation: http://${env.HOST}:${env.PORT}/docs`);
      logger.info(`🩺 Health Check: http://${env.HOST}:${env.PORT}/health`);
      logger.info(`🚀 API Base URL: http://${env.HOST}:${env.PORT}/api/v1`);
      logger.info(`⚙️  Environment: ${env.NODE_ENV}`);
      logger.info(`=============================================================`);
    });

    // Graceful Shutdown Handler
    const shutdown = async (signal: string) => {
      logger.info(`Received ${signal}. Shutting down KhmerAPI gracefully...`);

      server.close(async () => {
        logger.info('HTTP server closed');
        await disconnectDatabase();
        await disconnectRedis();
        logger.info('All connections terminated. Process exiting.');
        process.exit(0);
      });

      // Force exit after 10 seconds if lingering connections exist
      setTimeout(() => {
        logger.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000).unref();
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    logger.fatal({ err: error }, 'Failed to start KhmerAPI server');
    process.exit(1);
  }
}

startServer();
