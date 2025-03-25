import { drizzle } from 'drizzle-orm/node-postgres';
import {PatchTable, EntryTable} from "~/store/schema";
import  pg from "pg";

const postgresUrl = import.meta.env.VITE_POSTGRES_URL;

if(!postgresUrl) {
  throw new Error('POSTGRES_URL is not set');
}

const pool = new pg.Pool({
  connectionString: postgresUrl,
});

export const store = drizzle(pool, {
  schema: {
    PatchTable,
    EntryTable,
  },
  logger: false,
});

export type Store = typeof store;