import type { Response } from 'express';
import type { ApiResponse } from '../types/api-response';

export function sendSuccess<T>(
  res: Response,
  data: T,
  message?: string
): void {
  const response: ApiResponse<T> = {
    success: true,
    data,
    ...(message ? { message } : {}),
  };

  res.status(200).json(response);
}

export function sendPaginated<T>(
  res: Response,
  data: T[],
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }
): void {
  const response: ApiResponse<T[]> = {
    success: true,
    data,
    pagination,
  };

  res.status(200).json(response);
}