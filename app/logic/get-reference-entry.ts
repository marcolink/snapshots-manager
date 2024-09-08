import {StreamsType} from "~/types";
import {db} from "~/database";
import {entries} from "~/database/schema";
import {and, eq, inArray, sql} from "drizzle-orm";
import {Streams} from "~/logic/streams";

type Params = {
  space: string,
  environment: string,
  entry: string,
  stream: StreamsType,
}

export function getReferenceEntry(data: Params) {

// We need to transform th following query to drizzle-orm
//   WITH ordered_entries AS (
//     SELECT *,
//     ROW_NUMBER() OVER (ORDER BY createdAt DESC) AS row_num
//   FROM entries
//   WHERE entryId = 'your_entryId'
// )
//   SELECT *
//   FROM ordered_entries
//   WHERE row_num <= COALESCE((
//     SELECT MIN(row_num)
//   FROM ordered_entries
//   WHERE raw IS NOT NULL
// ), (SELECT MAX(row_num) FROM ordered_entries));

  const orderedEntries = db
    .$with('ordered_entries')
    .as(
      db
        .select({
          id: entries.id,
          raw_entry: entries.raw_entry,
          version: entries.version,
          row_num: sql<number>`ROW_NUMBER() OVER (ORDER BY ${entries.createdAt} DESC)`.mapWith(Number).as('row_num')
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
    )

  return db
    .with(orderedEntries)
    .select()
    .from(orderedEntries)
    .where(
      sql`row_num <= COALESCE((
        SELECT MIN(row_num)
        FROM ordered_entries
        WHERE raw_entry IS NOT NULL),(SELECT MAX(row_num) FROM ordered_entries))`
    )
    .execute();
}