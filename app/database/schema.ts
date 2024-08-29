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
  raw_entry: jsonb('raw_entry').notNull(),
  patch: jsonb('patch').default([]).notNull(),
  signature: text('signature').references(() => signature_content.signature, { onDelete: 'cascade' }),
});

export const signature_content = pgTable('signature_content_table', {
  id: serial('id').primaryKey(),
  space: text('space').notNull(),
  signature: text('signature').notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  data: jsonb('data').notNull(),
});

export type InsertEntry = typeof entries.$inferInsert;
export type SelectEntry = typeof entries.$inferSelect;