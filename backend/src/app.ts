
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import mongoose from 'mongoose';

import { env } from './config/env';
import { notFoundMiddleware } from './middlewares/not-found.middleware';
import { errorMiddleware } from './middlewares/error.middleware';
import apiV1Routes from './routes/api-v1.routes';
import { sendSuccess } from './utils/api-response';
import swaggerUi from 'swagger-ui-express';
import { openApiDocument } from './docs/openapi';
import { apiRateLimiter } from './middlewares/rate-limit.middleware';

const app = express();

// Security
app.disable('x-powered-by');
app.use(helmet());

const allowedOrigins = env.FRONTEND_ORIGINS
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

// CORS
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without Origin (e.g. server-to-server)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      // Reject untrusted origins
      callback(null, false);
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 204,
  })
);

// HTTP request logging
app.use(pinoHttp());

// Request parsing
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

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

// Apply rate limiting to versioned API routes
app.use('/api/v1', apiRateLimiter);

app.use('/api/v1', apiRateLimiter);
app.use('/api/v1', apiV1Routes);

app.use('/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(openApiDocument)
);

// Handle unknown routes
app.use(notFoundMiddleware);

// Centralised error handling
app.use(errorMiddleware);

export default app;
