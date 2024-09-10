import { migrate } from 'drizzle-orm/neon-http/migrator';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { config } from 'dotenv';
config({ path: '.env.local' });

import { neonConfig } from '@neondatabase/serverless';
import {sql} from "@vercel/postgres";

if (process.env.VERCEL_ENV === 'development') {
  console.log('Development environment detected');
  neonConfig.wsProxy = (host) => `${host}:54330/v1`;
  neonConfig.useSecureWebSocket = false;
  neonConfig.pipelineTLS = false;
  neonConfig.pipelineConnect = false;
}

// const sql = neon(process.env.POSTGRES_URL!);
const db = drizzle(sql);

const main = async () => {
  try {
    // @ts-ignore
    await migrate(db, { migrationsFolder: 'migrations' });
    console.log('Migration completed');
  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  }
};
await main();
// process.exit(0);