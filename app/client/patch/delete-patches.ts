import {PatchTable} from "~/database/schema";
import {db} from "~/database";
import {inArray} from "drizzle-orm";

// delete entry by contentful entry id
export function deletePatches(entryIds: string[]) {
  return db.delete(PatchTable).where((inArray(PatchTable.entry, entryIds))).execute();
}