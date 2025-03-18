import { drizzle } from 'drizzle-orm/node-postgres';
import {entries, rawEntries} from "~/database/schema";
import  pg from "pg";

const postgresUrl = import.meta.env.VITE_POSTGRES_URL;

if(!postgresUrl) {
  throw new Error('POSTGRES_URL is not set');
}

const pool = new pg.Pool({
  connectionString: postgresUrl,
});

export const db = drizzle(pool, {
  schema: {
    entries,
    rawEntries,
  },
  logger: false,
});
