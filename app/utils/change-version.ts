import {EntryData} from "~/types";

export function printVersion({version, operation}: Pick<EntryData, 'version' | 'operation'>):string {
  return `${operation === 'publish' ? 'v' : 'r'}${version}`;
}