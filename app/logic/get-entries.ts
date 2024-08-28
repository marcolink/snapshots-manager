import {db} from "~/database";
import {entries} from "~/database/schema";
import {and, desc, eq, inArray} from "drizzle-orm";
import {operationStreams, OperationStreams} from "~/logic/streams";

type GetEntriesParams = {
  q?: {
    space?: string,
    environment?: string,
    entry?: string,
    stream?: OperationStreams,
  }
  limit?: number
}

export const getEntries = async ({q, limit = 100}: GetEntriesParams) => {
  const query = db
    .select()
    .from(entries)
    .limit(limit)
    .orderBy(desc(entries.createdAt))

  if (q) {
    query.where(
      and(
        q.space ? eq(entries.space, q.space) : undefined,
        q.environment ? eq(entries.environment, q.environment) : undefined,
        q.entry ? eq(entries.entry, q.entry) : undefined,
        q.stream ? inArray(entries.operation, operationStreams[q.stream]) : undefined,
      )
    )
  }

  return query.execute();
}
