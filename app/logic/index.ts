import {createEntry} from "./create-entry";
import {getEntries} from "~/logic/get-entries";
import {getEntriesCount} from "~/logic/get-entries-count";

export const client = {
  createEntry,
  getEntries,
  getEntriesCount
}