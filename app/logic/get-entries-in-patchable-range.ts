import {StreamsType} from "~/types";
import {db} from "~/database";
import {entries} from "~/database/schema";
import {and, eq, inArray, lte, sql} from "drizzle-orm";
import {Streams} from "~/logic/streams";

type Params = {
  space: string,
  environment: string,
  entry: string,
  stream: StreamsType,
  maxRange?: number
}

export function getEntriesInPatchableRange(data: Params) {
  const orderedEntries = db
    .$with('ordered_entries')
    .as(
      db
        .select({
          id: entries.id,
          raw_entry: entries.raw_entry,
          patch: entries.patch,
          version: entries.version,
          non_null_raw_flag: sql<number>`SUM(CASE WHEN raw_entry IS NOT NULL THEN 1 ELSE 0 END) 
               OVER (PARTITION BY entry ORDER BY created_at DESC)`.mapWith(Number).as('non_null_raw_flag')
        })
        .from(entries)
        .where(
          and(
            eq(entries.space, data.space),
            eq(entries.environment, data.environment),
            eq(entries.entry, data.entry),
            inArray(entries.operation, Streams[data.stream])
          )
        )
        // .limit(data.maxRange ?? 100)
    )

  return db
    .with(orderedEntries)
    .select()
    .from(orderedEntries)
    .where(
      lte(sql`non_null_raw_flag`, 1)
    )
    .execute();
}