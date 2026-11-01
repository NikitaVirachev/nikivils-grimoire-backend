import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config({ path: 'config.env' });

const positiveInteger = z.coerce.number<string>().int().positive();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  PORT: positiveInteger.max(65535).default(3000),

  FRONTEND_DIR: z.string().min(1),

  DATABASE_URL: z.string().min(1),

  MAX_IMAGE_SIZE: positiveInteger.default(10 * 1024 * 1024),

  MAX_IMAGE_PIXELS: positiveInteger.default(40_000_000),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error('Invalid environment configuration:');

  console.error(z.prettifyError(result.error));

  throw new Error('Environment validation failed');
}

const env = result.data;

export default env;
