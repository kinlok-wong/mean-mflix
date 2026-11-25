import rateLimit from 'express-rate-limit';

interface RateLimitOptions {
  windowMs?: number;
  limit?: number;
}

export function createApiRateLimiter(
  options: RateLimitOptions = {},
) {
  return rateLimit({
    windowMs: options.windowMs ?? 15 * 60 * 1000,
    limit: options.limit ?? 100,

    standardHeaders: 'draft-8',
    legacyHeaders: false,

    message: {
      success: false,
      error: {
        message: 'Too many requests. Please try again later.',
      },
    },
  });
}

// Default limiter for the application
export const apiRateLimiter = createApiRateLimiter();
