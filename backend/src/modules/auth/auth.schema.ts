
import { z } from 'zod';

export const registerSchema = z
  .strictObject({
    email: z.string().trim().pipe(z
        .email({
        error: 'Please provide a valid email address',
        })
        .max(254, {
        error: 'Email address is too long',
        })
        .toLowerCase()
    ),

    displayName: z
      .string()
      .trim()
      .min(2, 'Display name must contain at least 2 characters')
      .max(100, 'Display name cannot exceed 100 characters'),

    password: z
      .string()
      .min(12, 'Password must contain at least 12 characters')
      .max(128, 'Password cannot exceed 128 characters'),

    confirmPassword: z
      .string()
      .min(1, 'Please confirm your password'),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    }
  );

export type RegisterInput = z.infer<typeof registerSchema>;
