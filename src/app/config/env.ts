import 'dotenv/config';

const requiredEnv = (name: string): string => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
};

const env = {
  DATABASE_URL: requiredEnv('DATABASE_URL'),
  PORT: Number(process.env.PORT ?? 3000),
};

export default env;
