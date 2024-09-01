import {createEntry} from "./create-entry";
import {getEntries} from "~/logic/get-entries";
import {getEntriesCount} from "~/logic/getEntriesCount";

export const client = {
  createEntry,
  getEntries,
  getEntriesCount
}