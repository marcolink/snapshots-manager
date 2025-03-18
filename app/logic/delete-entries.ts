import {entries} from "~/database/schema";
import {db} from "~/database";
import {inArray} from "drizzle-orm";

// delete entry by contentful entry id
export function deleteEntries(ids: string[]) {
  return db.delete(entries).where((inArray(entries.entry, ids))).execute();
}