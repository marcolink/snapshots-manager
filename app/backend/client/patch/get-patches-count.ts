import {store} from "~/backend/store";
import {PatchTable} from "~/backend/store/schema";
import {count} from "drizzle-orm";
import {ScopedQueryParams, ScopedQueryParamsType} from "~/backend/client/validations";
import {spaceEnvEntryFilter} from "~/backend/client/queries/space-env-entry-filter";

type GetEntriesParams = {
  query: ScopedQueryParamsType
}

export const getPatchesCount = async ({query}: GetEntriesParams) => {
  const ids = ScopedQueryParams.parse(query);
  const dbQuery = store
    .select({count: count()})
    .from(PatchTable)
    .where(
      spaceEnvEntryFilter(ids)
    );
  return (await dbQuery.execute())[0];
}
