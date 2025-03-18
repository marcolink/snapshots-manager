import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

if(process.env.NODE_ENV === 'production') {
  console.log('Using .env');
  config({ path: '.env' });
} else {
  console.log('Using .env.local');
  config({ path: '.env.local' });
}

console.log(`NODE_ENV: "${process.env.NODE_ENV}"`)

const postgresUrl = process.env.VITE_POSTGRES_URL;

if(!postgresUrl) {
  throw new Error('VITE_POSTGRES_URL is not set');
}

export default defineConfig({
  schema: './app/database/schema.ts',
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: postgresUrl!,
  },
});