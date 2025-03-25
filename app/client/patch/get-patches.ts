import {store} from "~/store";
import {PatchTable} from "~/store/schema";
import {and, desc, eq, inArray} from "drizzle-orm";
import {StreamsType} from "~/types";
import {Streams} from "~/client/streams";

type GetEntriesParams = {
  q?: {
    space?: string,
    environment?: string,
    entry?: string,
    stream?: StreamsType,
  }
  limit?: number
}

export const getPatches = async ({q, limit = 100}: GetEntriesParams) => {
  const query = store
    .select({
      id: PatchTable.id,
      byUser: PatchTable.byUser,
      version: PatchTable.version,
      space: PatchTable.space,
      environment: PatchTable.environment,
      entry: PatchTable.entry,
      operation: PatchTable.operation,
      createdAt: PatchTable.createdAt,
      patch: PatchTable.patch,
    })
    .from(PatchTable)
    .limit(limit)
    .orderBy(desc(PatchTable.createdAt))

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

  return query.execute();
}
