
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import mongoose from 'mongoose';

import { env } from './config/env';
import { notFoundMiddleware } from './middleware/not-found.middleware';
import { errorMiddleware } from './middleware/error.middleware';
import movieRoutes from './modules/movies/movie.routes';
import { sendSuccess } from './utils/api-response';

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
  sendSuccess(res, {
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  }, 'Movie Explorer API is running');
});

// Database readiness
app.get('/api/health/ready', (_req, res) => {
  const isDatabaseConnected =
    mongoose.connection.readyState === 1;

  sendSuccess(res, {
    database: isDatabaseConnected ? 'connected' : 'disconnected',
  }, isDatabaseConnected ? 'Database is connected' : 'Database is disconnected');
});

app.use('/api/v1/movies', movieRoutes);

// Handle unknown routes
app.use(notFoundMiddleware);

// Centralised error handling
app.use(errorMiddleware);

export default app;
