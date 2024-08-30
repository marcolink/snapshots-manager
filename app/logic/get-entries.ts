import {db} from "~/database";
import {entries} from "~/database/schema";
import {and, desc, eq, inArray, sql} from "drizzle-orm";
import {Streams} from "~/logic/streams";
import {StreamsType} from "~/types";

type GetEntriesParams = {
  q?: {
    space?: string,
    environment?: string,
    entry?: string,
    stream?: StreamsType,
    signature?: string,
  }
  limit?: number
}

export const getEntries = async ({q, limit = 100}: GetEntriesParams) => {
  const query = db
    .select({
      id: entries.id,
      byUser: entries.byUser,
      version: entries.version,
      space: entries.space,
      environment: entries.environment,
      entry: entries.entry,
      operation: entries.operation,
      createdAt: entries.createdAt,
      raw_entry: entries.raw_entry,
      patch: entries.patch,
      signature: entries.signature,
      matches: sql<string[]>`sig_ids.matches`
    })
    .from(entries)
    .limit(limit)
    .orderBy(desc(entries.createdAt))

  if (q) {

    console.log('entries query params', q)

    query.where(
      and(
        q.space ? eq(entries.space, q.space) : undefined,
        q.environment ? eq(entries.environment, q.environment) : undefined,
        q.entry ? eq(entries.entry, q.entry) : undefined,
        q.stream ? inArray(entries.operation, Streams[q.stream]) : undefined,
        q.signature ? eq(entries.signature, q.signature) : undefined,

      )
    ).leftJoin(
      sql`
    (
        SELECT signature, ARRAY_AGG(id) as matches 
        FROM entry_table 
        GROUP BY signature
    ) sig_ids`,
      eq(entries.signature, sql`sig_ids.signature`)
    )
  }

  return query.execute();
}
