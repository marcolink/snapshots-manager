import {db} from "~/database";
import {rawEntries} from "~/database/schema";
import {streamKeyForOperation} from "~/logic/streams";
import {Params} from "~/logic/types";

export function upsertRawEntry(data:Params & {version: number}) {
  return db
    .insert(rawEntries)
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
      target: [rawEntries.space, rawEntries.environment, rawEntries.entry, rawEntries.stream],
      set: {
        version: data.version,
        raw: data.raw,
        createdAt: new Date()
      },
    })
}