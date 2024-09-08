import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { config } from 'dotenv';
import {entries} from "~/database/schema";
import {neonConfig} from "@neondatabase/serverless";
config({ path: '.env.local' }); // or .env

if (process.env.VERCEL_ENV === 'development') {
  neonConfig.wsProxy = (host) => `${host}:54330/v1`;
  neonConfig.useSecureWebSocket = false;
  neonConfig.pipelineTLS = false;
  neonConfig.pipelineConnect = false;
}

export const db = drizzle(sql, {
  schema: {
    entries
  },
  logger: false,
});