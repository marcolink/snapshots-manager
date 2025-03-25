import {EntryProps} from "contentful-management";
import {store} from "~/backend/store";
import {PatchTable, SelectEntry} from "~/backend/store/schema";
import {Patch} from "generate-json-patch";
import {getRawEntry} from "../entry/get-raw-entry";
import {upsertRawEntry} from "../entry/upsert-raw-entry";
import {createEntryPatch} from "~/backend/client/utils/create-entry-patch";
import {Params, WebhookEventPayload, WebhookEventPayloadWithData} from "~/shared/types";
import {streamKeyForOperation} from "~/shared/streams";

export const createPatch = async (data: Params) => {
  const referenceEntry = (await getRawEntry({
    space: data.space,
    environment: data.environment,
    entry: data.raw.sys.id,
    operation: data.operation
  })) ?? getDefaultReferenceEntry(data);
  const source = referenceEntry.raw as EntryProps;
  // @ts-expect-error to lazy to fix
  const version = data.raw.sys.revision ?? data.raw.sys.version

  let patch: Patch = []
  let rawEntry: EntryProps = source

  const eventHasEntryPayload = isWebhookEventWithEntryPayload(data)

  // for operations that provide an entry payload, we can create a patch
  if (eventHasEntryPayload) {
    const target = data.raw;
    patch = createEntryPatch(source, target)
    rawEntry = target;
  }

  const {space, environment, raw: {sys: {id: entry}}, operation, byUser} = data

  return store.transaction(async (tx) => {
    await upsertRawEntry({
      space,
      environment,
      entry,
      raw: rawEntry,
      version,
      // Fixing this will also fix the requirement to always update the raw entry
      operation: operation as WebhookEventPayloadWithData['operation'],
    }, tx)
    return tx.insert(PatchTable).values({
      space,
      environment,
      entry,
      version,
      operation,
      patch,
      byUser,
    }).returning().execute();
  });
}

function getDefaultReferenceEntry(data: Params): SelectEntry {
  return {
    createdAt: new Date(),
    id: 0,
    entry: data.raw.sys.id,
    version: 0,
    space: data.space,
    environment: data.environment,
    raw: {...data.raw, fields: {}, metadata: {tags: []}},
    stream: streamKeyForOperation(data.operation)
  }
}

function isWebhookEventWithEntryPayload(webhookEvent: WebhookEventPayload): webhookEvent is WebhookEventPayloadWithData {
  return [
    'save',
    'auto_save',
    'create',
    'publish'
  ].includes(webhookEvent.operation)
}