import {EntryData} from "~/types";
import {VersionActions} from "~/logic/streams";

export function printVersion({version, operation}: Pick<EntryData, 'version' | 'operation'>):string {
  return `${VersionActions.includes(operation) ? 'v' : 'r'}${version}`;
}