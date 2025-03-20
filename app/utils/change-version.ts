import {PatchEntry} from "~/types";
import {WebhookVersionEvent} from "~/client/streams";

export function printVersion({version, operation}: Pick<PatchEntry, 'version' | 'operation'>): string {
  const isVersionEvent = WebhookVersionEvent.some(e => e === operation)
  return `${isVersionEvent ? 'v' : 'r'}${version}`;
}