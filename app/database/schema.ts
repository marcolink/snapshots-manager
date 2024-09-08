import { jsonb, pgTable, serial, text, timestamp, integer } from 'drizzle-orm/pg-core';

export const entries = pgTable('entry_table', {
  id: serial('id').primaryKey(),
  byUser: text('by_user').notNull(),
  version: integer('version').notNull(),
  space: text('space').notNull(),
  environment: text('environment').notNull(),
  entry: text('entry').notNull(),
  operation: text('operation').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  raw_entry: jsonb('raw_entry'),
  patch: jsonb('patch').default([]).notNull(),
  signature: text('signature').notNull(),
});

export type InsertEntry = typeof entries.$inferInsert;
export type SelectEntry = typeof entries.$inferSelect;