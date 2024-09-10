import {createEntry} from "./create-entry";
import {getEntries} from "~/logic/get-entries";
import {getEntriesCount} from "~/logic/get-entries-count";
import {getEntriesInPatchableRange} from "~/logic/get-entries-in-patchable-range";

export const client = {
  createEntry,
  getEntries,
  getEntriesCount,
  getEntriesInPatchableRange,
}