import {createEntry} from "./create-entry";
import {getEntries} from "~/logic/get-entries";
import {getEntriesCount} from "~/logic/get-entries-count";
import { getReferenceEntry } from "./get-reference-entry";
import {getEntriesInPatchableRange} from "~/logic/get-entries-in-patchable-range";

export const client = {
  createEntry,
  getEntries,
  getEntriesCount,
  getReferenceEntry,
  getEntriesInPatchableRange,
}