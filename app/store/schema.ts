import {customType, index, integer, jsonb, pgTable, serial, text, timestamp, unique} from 'drizzle-orm/pg-core';
import {WebhookEvent} from "~/types";

const operation = customType<{data: WebhookEvent, notNull: true}>({
  dataType() {
    return 'text';
  },
})

const stream = customType<{data: 'publish' | 'draft', notNull: true}>({
  dataType() {
    return 'text';
  },
})

export const PatchTable = pgTable('entry_table', {
  id: serial('id').primaryKey(),
  byUser: text('by_user').notNull(),
  version: integer('version').notNull(),
  space: text('space').notNull(),
  environment: text('environment').notNull(),
  entry: text('entry').notNull(),
  operation: operation('operation').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  patch: jsonb('patch').default([]).notNull(),
}, (table) => ({
  spaceEnvEntryIdx: index().on(table.space, table.environment, table.entry),
}));

export const EntryTable = pgTable('raw_entry_table', {
  id: serial('id').primaryKey(),
  version: integer('version').notNull(),
  space: text('space').notNull(),
  environment: text('environment').notNull(),
  entry: text('entry').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  raw: jsonb('raw').notNull(),
  stream: stream('stream').notNull(),
}, (table) => ({
  uniqueSpaceEnvEntryStream: unique().on(table.space, table.environment, table.entry, table.stream),
}));

export type SelectPatch = typeof PatchTable.$inferSelect;
export type SelectEntry = typeof EntryTable.$inferSelect;