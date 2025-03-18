import {db} from "~/database";
import {entries} from "~/database/schema";
import {and, desc, eq, inArray} from "drizzle-orm";
import {Streams} from "~/logic/streams";
import {StreamsType} from "~/types";

type GetEntriesParams = {
  q?: {
    space?: string,
    environment?: string,
    entry?: string,
    stream?: StreamsType,
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
      patch: entries.patch,
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
      )
    )
  }

  return query.execute();
}
