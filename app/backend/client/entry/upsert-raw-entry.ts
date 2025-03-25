import {EntryTable} from "~/backend/store/schema";
import {store, Store} from "~/backend/store";
import {streamKeyForOperation} from "~/shared/streams";
import {BaseParams, WebhookEvent, WebhookEventPayloadWithData} from "~/shared/types";

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