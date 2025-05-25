import {store} from "~/backend/store";
import {PatchTable} from "~/backend/store/schema";
import {desc} from "drizzle-orm";
import {ScopedQueryParams, ScopedQueryParamsType} from "~/backend/client/validations";
import {spaceEnvEntryFilter} from "~/backend/client/queries/space-env-entry-filter";

type QueryParamsType = ScopedQueryParamsType

type GetEntriesParams = {
  query: QueryParamsType
  limit?: number
}

export const getPatches = async ({query, limit = 100}: GetEntriesParams) => {
  const ids = ScopedQueryParams.parse(query);
  return store
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
    .orderBy(
      desc(PatchTable.createdAt)
    )
    .where(
      spaceEnvEntryFilter(ids)
    )
    .execute();
}
