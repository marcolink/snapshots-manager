import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({ path: '.env' });

const postgresUrl = process.env.VITE_POSTGRES_URL;

if(!postgresUrl) {
  throw new Error('VITE_POSTGRES_URL is not set');
}

export default defineConfig({
  schema: './app/backend/store/schema.ts',
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: postgresUrl!,
  },
});