import {db} from "~/database";
import {entries} from "~/database/schema";
import {and, count, eq, inArray} from "drizzle-orm";
import {Streams} from "~/logic/streams";
import {StreamsType} from "~/types";

type GetEntriesParams = {
  q?: {
    space?: string,
    environment?: string,
    entry?: string,
    stream?: StreamsType,
  }
}

export const getEntriesCount = async ({q}: GetEntriesParams) => {
  const query = db
    .select({count: count()})
    .from(entries)

  if (q) {
    console.log('entries count query params', q)
    query.where(
      and(
        q.space ? eq(entries.space, q.space) : undefined,
        q.environment ? eq(entries.environment, q.environment) : undefined,
        q.entry ? eq(entries.entry, q.entry) : undefined,
        q.stream ? inArray(entries.operation, Streams[q.stream]) : undefined,
      )
    )
  }

  return (await query.execute())[0];
}
