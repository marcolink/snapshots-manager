import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

if(process.env.NODE_ENV === 'production') {
  config({ path: '.env' });
} else {
  config({ path: '.env.local' });
}

export default defineConfig({
  schema: './app/database/schema.ts',
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
});