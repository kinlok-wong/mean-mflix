
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import mongoose from 'mongoose';

import { env } from './config/env';
import { notFoundMiddleware } from './middleware/not-found.middleware';
import { errorMiddleware } from './middleware/error.middleware';

const app = express();

// Security
app.disable('x-powered-by');
app.use(helmet());

// CORS
app.use(
  cors({
    origin: env.FRONTEND_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Request parsing
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// HTTP request logging
app.use(pinoHttp());

// Health check
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Movie Explorer API is running',
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// Database readiness
app.get('/api/health/ready', (_req, res) => {
  const isDatabaseConnected =
    mongoose.connection.readyState === 1;

  res.status(isDatabaseConnected ? 200 : 503).json({
    success: isDatabaseConnected,
    database: isDatabaseConnected ? 'connected' : 'disconnected',
  });
});

// Handle unknown routes
app.use(notFoundMiddleware);

// Centralised error handling
app.use(errorMiddleware);

export default app;
