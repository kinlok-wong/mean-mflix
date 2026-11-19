
import 'dotenv/config';

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import pinoHttp from 'pino-http';
import mongoose from 'mongoose';

import {
  connectDatabase,
  disconnectDatabase
} from './config/database';

const app = express();

app.use(helmet());

app.use(cors({
  origin: process.env.FRONTEND_ORIGIN
    ?? 'http://localhost:4200'
}));

app.use(express.json({ limit: '1mb' }));

app.use(pinoHttp());

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'mean-mflix-api'
  });
});

app.get('/api/health/ready', (_req, res) => {
  const databaseConnected =
    mongoose.connection.readyState === 1;

  res.status(databaseConnected ? 200 : 503).json({
    status: databaseConnected ? 'ready' : 'not-ready',
    database: databaseConnected ? 'connected' : 'disconnected'
  });
});

async function startServer(): Promise<void> {
  await connectDatabase();

  const port = Number(process.env.PORT ?? 3000);

  const server = app.listen(port, () => {
    console.log(`API listening on port ${port}`);
  });

  const shutdown = async () => {
    console.log('Shutting down API...');

    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

startServer().catch((error: unknown) => {
  console.error('Failed to start API', error);
  process.exit(1);
});
