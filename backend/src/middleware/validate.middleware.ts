
import type { RequestHandler } from 'express';
import type { z } from 'zod';

import { AppError } from '../utils/app-error';

// Ensure request body uses JSON format
export const requireJson: RequestHandler = (req, _res, next) => {
  if (!req.is('application/json')) {
    return next(
      new AppError(
        'Content-Type must be application/json',
        415
      )
    );
  }

  next();
};

export function validateBody<T extends z.ZodType>(
  schema: T
): RequestHandler {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return next(result.error);
    }

    req.body = result.data;
    next();
  };
}

export function validateQuery<T extends z.ZodType>(
  schema: T
): RequestHandler {
  return (req, res, next) => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      return next(result.error);
    }

    res.locals.movieQuery = result.data;
    next();
  };
}
