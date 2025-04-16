// src/config/loadEnv.ts
import dotenv from 'dotenv';
import path from 'path';

export function loadEnv() {
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';
  const envFile = `.env.${process.env.NODE_ENV}`;
  const envPath = path.resolve(__dirname, `../../${envFile}`);

  dotenv.config({ path: envPath });

  console.log(`📦 Loaded environment from ${envFile}`);
  console.log(`🌍 NODE_ENV = ${process.env.NODE_ENV}`);
}
