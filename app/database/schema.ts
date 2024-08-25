import { jsonb, pgTable, serial, text, timestamp, integer } from 'drizzle-orm/pg-core';

export const entryTable = pgTable('entry_table', {
  id: serial('id').primaryKey(),
  version: integer('version').notNull(),
  space: text('space').notNull(),
  environment: text('environment').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  raw_entry: jsonb('raw_entry').notNull(),
  patch: jsonb('patch').notNull(),
});

export type InsertEntry = typeof entryTable.$inferInsert;
export type SelectEntry = typeof entryTable.$inferSelect;