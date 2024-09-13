import {customType, integer, jsonb, pgTable, serial, text, timestamp} from 'drizzle-orm/pg-core';
import {WebhookActions} from "~/types";
import {Patch} from "generate-json-patch";

const customPatch = customType<{ data: Patch, default: true, notNull: true }>({
  dataType() {
    return 'jsonb';
  },
})

const customOperation = customType<{ data: WebhookActions, notNull: true }>({
  dataType() {
    return 'text';
  },
})

export const entries = pgTable('entry_table', {
  id: serial('id').primaryKey(),
  byUser: text('by_user').notNull(),
  version: integer('version').notNull(),
  space: text('space').notNull(),
  environment: text('environment').notNull(),
  entry: text('entry').notNull(),
  operation: customOperation('operation').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  raw_entry: jsonb('raw_entry').notNull(),
  patch: jsonb('patch').default([]).notNull(),
  signature: text('signature').notNull(),
});


export type InsertEntry = typeof entries.$inferInsert;
export type SelectEntry = typeof entries.$inferSelect;