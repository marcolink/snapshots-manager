import {createEntry} from "./create-entry";
import {getEntries} from "~/logic/get-entries";
import {getEntriesCount} from "~/logic/get-entries-count";
import {getRawEntry} from "~/logic/get-raw-entry";

export const client = {
  createEntry,
  getEntries,
  getEntriesCount,
  getRawEntry,
}