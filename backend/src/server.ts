import 'dotenv/config';

import {
  connectDatabase,
  connectAppDatabase,
  disconnectDatabase,
} from './config/database';

import { env } from './config/env';
import app from './app';

async function startServer(): Promise<void> {
  try {
    // Connect to Movie Database
    await connectDatabase();

    // Connect to Application Database
    await connectAppDatabase();

    // Start Express Server only after both connections succeed
    const server = app.listen(env.PORT, () => {
      console.log(
        `API server running at http://localhost:${env.PORT}`
      );
    });

    let isShuttingDown = false;

    const shutdown = async (signal: string) => {
      if (isShuttingDown) {
        return;
      }

      isShuttingDown = true;

      console.log(`${signal} received. Shutting down...`);

      server.close(async (error) => {
        try {
          if (error) {
            throw error;
          }

          await disconnectDatabase();

          console.log('Server shutdown completed.');
          process.exit(0);
        } catch (error) {
          console.error('Error during shutdown:', error);
          process.exit(1);
        }
      });
    };

    process.on('SIGTERM', () => void shutdown('SIGTERM'));
    process.on('SIGINT', () => void shutdown('SIGINT'));

  } catch (error) {
    console.error('Failed to start server:', error);

    await disconnectDatabase().catch((disconnectError) => {
      console.error(
        'Database cleanup failed:',
        disconnectError
      );
    });

    process.exit(1);
  }
}

void startServer();
