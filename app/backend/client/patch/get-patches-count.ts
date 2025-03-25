import {store} from "~/backend/store";
import {PatchTable} from "~/backend/store/schema";
import {and, count, eq, inArray} from "drizzle-orm";
import {Streams} from "~/shared/streams";
import {StreamsType} from "~/shared/types";

type GetEntriesParams = {
  q?: {
    space?: string,
    environment?: string,
    entry?: string,
    stream?: StreamsType,
  }
}

export const getPatchesCount = async ({q}: GetEntriesParams) => {
  const query = store
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
