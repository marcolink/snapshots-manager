import { drizzle } from 'drizzle-orm/node-postgres';
import {entries, rawEntries} from "~/database/schema";
import  pg from "pg";

console.log({env: import.meta.env.POSTGRES_URL});

const postgresUrl = import.meta.env.POSTGRES_URL;

if(!postgresUrl) {
  throw new Error('POSTGRES_URL is not set');
}

const pool = new pg.Pool({
  connectionString: import.meta.env.POSTGRES_URL,
});

export const db = drizzle(pool, {
  schema: {
    entries,
    rawEntries,
  },
  logger: false,
});
