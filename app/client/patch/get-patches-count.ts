import {db} from "~/database";
import {PatchTable} from "~/database/schema";
import {and, count, eq, inArray} from "drizzle-orm";
import {StreamsType} from "~/types";
import {Streams} from "~/client/streams";

type GetEntriesParams = {
  q?: {
    space?: string,
    environment?: string,
    entry?: string,
    stream?: StreamsType,
  }
}

export const getPatchesCount = async ({q}: GetEntriesParams) => {
  const query = db
    .select({count: count()})
    .from(PatchTable)

  if (q) {
    query.where(
      and(
        q.space ? eq(PatchTable.space, q.space) : undefined,
        q.environment ? eq(PatchTable.environment, q.environment) : undefined,
        q.entry ? eq(PatchTable.entry, q.entry) : undefined,
        q.stream ? inArray(PatchTable.operation, Streams[q.stream]) : undefined,
      )
    )
  }

  return (await query.execute())[0];
}
