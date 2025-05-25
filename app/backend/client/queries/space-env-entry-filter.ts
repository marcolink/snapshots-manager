import {ScopedQueryParamsType} from "~/backend/client/validations";
import {and, eq} from "drizzle-orm";
import {PatchTable} from "~/backend/store/schema";

export function spaceEnvEntryFilter(queryParams: ScopedQueryParamsType) {
  return and(
    eq(PatchTable.space, queryParams.space),
    eq(PatchTable.environment, queryParams.environment),
    eq(PatchTable.entry, queryParams.entry),
  );
}