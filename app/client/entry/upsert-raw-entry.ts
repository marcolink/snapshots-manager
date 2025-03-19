import {EntryTable} from "~/database/schema";
import {streamKeyForOperation} from "./../streams";
import {Params} from "./../types";
import {db} from "~/database";

export function upsertRawEntry(data:Params & {version: number}, dbContext: typeof db = db) {
  return dbContext
    .insert(EntryTable)
    .values({
      space: data.space,
      environment: data.environment,
      stream: streamKeyForOperation(data.operation),
      entry: data.raw.sys.id,
      version: data.version,
      raw: data.raw,
      createdAt: new Date(), // or omit to use defaultNow()
    })
    .onConflictDoUpdate({
      target: [EntryTable.space, EntryTable.environment, EntryTable.entry, EntryTable.stream],
      set: {
        version: data.version,
        raw: data.raw,
        createdAt: new Date()
      },
    })
}