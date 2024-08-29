import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { config } from 'dotenv';
import {entries} from "~/database/schema";
config({ path: '.env.local' }); // or .env
export const db = drizzle(sql, {
  schema: {
    entries
  },
  logger: false,
});