import { test, expect } from '@playwright/test';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import type { Server } from 'node:http';
import { createApiRateLimiter } from '../../backend/src/middlewares/rate-limit.middleware';

const backendRequire = createRequire(
  resolve(process.cwd(), 'backend/package.json'),
);

const express = backendRequire('express');

test.describe('Rate Limiter', () => {
  let server: Server;
  let baseUrl: string;

  test.beforeAll(async () => {
    const app = express();

    // Allow only 2 requests within 60 seconds.
    app.use(
      createApiRateLimiter({
        windowMs: 60_000,
        limit: 2,
      }),
    );

    app.get('/test', (_req, res) => {
      res.status(200).json({ success: true });
    });

    await new Promise<void>((resolve) => {
      server = app.listen(0, '127.0.0.1', resolve);
    });

    const address = server.address();

    if (!address || typeof address === 'string') {
      throw new Error('Unable to start test server');
    }

    baseUrl = `http://127.0.0.1:${address.port}`;
  });

  test.afterAll(async () => {
    if (server) {
      await new Promise<void>((resolve, reject) => {
        server.close((error) => {
          if (error) reject(error);
          else resolve();
        });
      });
    }
  });

  test('should return 429 after exceeding the request limit', async () => {
    // First request: allowed
    const firstResponse = await fetch(`${baseUrl}/test`);

    expect(firstResponse.status).toBe(200);

    // Second request: allowed
    const secondResponse = await fetch(`${baseUrl}/test`);

    expect(secondResponse.status).toBe(200);

    // Third request: blocked
    const thirdResponse = await fetch(`${baseUrl}/test`);

    expect(thirdResponse.status).toBe(429);

    const body = await thirdResponse.json();

    expect(body.success).toBe(false);
    expect(body.error.message).toBe(
      'Too many requests. Please try again later.',
    );

    // Verify standard rate limit headers
    expect(
      thirdResponse.headers.get('ratelimit'),
    ).not.toBeNull();
  });
});
