import {db} from "~/database";
import {entries, rawEntries} from "~/database/schema";
import {inArray} from "drizzle-orm";

export function deleteRawEntries(ids: string[]) {
  return db.delete(rawEntries).where((inArray(entries.entry, ids))).execute();
}