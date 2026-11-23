
import type {
  ErrorRequestHandler,
} from 'express';

import { ZodError } from 'zod';
import { AppError } from '../utils/app-error';

export const errorMiddleware: ErrorRequestHandler = (
  error,
  req,
  res,
  _next
) => {

  // Request body too large
  if (
    error instanceof Error &&
    'status' in error &&
    error.status === 413 &&
    'type' in error &&
    error.type === 'entity.too.large'
  ) {
    res.status(413).json({
      success: false,
      error: {
        message: 'Request body is too large',
      },
    });

    return;
  }

  // Malformed JSON error
  if (
    error instanceof SyntaxError &&
    'status' in error &&
    error.status === 400 &&
    'type' in error &&
    error.type === 'entity.parse.failed'
  ) {
    res.status(400).json({
      success: false,
      error: {
        message: 'Invalid JSON request body',
      },
    });

    return;
  }

  // Zod validation error
  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: {
        message: 'Validation failed',
        details: error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      },
    });

    return;
  }

  // Known application error
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      error: {
        message: error.message,
      },
    });

    return;
  }

  // Unexpected error
  req.log?.error({ err: error }, 'Unhandled application error');

  res.status(500).json({
    success: false,
    error: {
      message: 'Internal server error',
    },
  });
};
