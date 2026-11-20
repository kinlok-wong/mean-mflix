
import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),

  PORT: z.coerce.number().int().min(1).max(65535).default(3000),

  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),

  MONGODB_X509_CERT_PATH: z
    .string()
    .min(1, 'MONGODB_X509_CERT_PATH is required'),

  MONGODB_X509_CERT_PASSWORD: z.string().optional(),

  FRONTEND_ORIGIN: z
    .string()
    .url('FRONTEND_ORIGIN must be a valid URL')
    .default('http://localhost:4200'),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('Invalid environment configuration:');

  console.error(
    z.prettifyError(parsedEnv.error)
  );

  process.exit(1);
}

export const env = Object.freeze(parsedEnv.data);
