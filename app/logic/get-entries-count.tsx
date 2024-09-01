import {db} from "~/database";
import {entries} from "~/database/schema";
import {and, count, desc, eq, inArray, sql} from "drizzle-orm";
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
        q.signature ? eq(entries.signature, q.signature) : undefined,
      )
    )
  }

  return (await query.execute())[0];
}
