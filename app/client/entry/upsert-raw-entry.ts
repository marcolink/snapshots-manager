import {EntryTable} from "~/store/schema";
import {streamKeyForOperation} from "./../streams";
import {BaseParams, WebhookEventPayloadWithData} from "./../types";
import {store, Store} from "~/store";
import {WebhookEvent} from "~/types";

type UpsertRawEntryParams = BaseParams & WebhookEventPayloadWithData & {
  version: number,
  operation: WebhookEvent
}

export function upsertRawEntry({space, environment, entry, raw, version, operation}: UpsertRawEntryParams, storeCtx: Store = store) {
  return storeCtx
    .insert(EntryTable)
    .values({
      space,
      environment,
      entry,
      raw,
      version,
      stream: streamKeyForOperation(operation),
    })
    .onConflictDoUpdate({
      target: [EntryTable.space, EntryTable.environment, EntryTable.entry, EntryTable.stream],
      set: {
        version,
        raw,
      },
    })
}