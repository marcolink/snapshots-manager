import {WebhookVersionEvent} from "~/shared/streams";
import {PatchEntry} from "~/shared/types";

export function printVersion({version, operation}: Pick<PatchEntry, 'version' | 'operation'>): string {
  const isVersionEvent = WebhookVersionEvent.some(e => e === operation)
  return `${isVersionEvent ? 'v' : 'r'}${version}`;
}