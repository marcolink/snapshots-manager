import {EntryProps} from "contentful-management";
import {db} from "~/database";
import {entries, rawEntries, SelectRawEntry} from "~/database/schema";
import {streamKeyForOperation} from "~/logic/streams";
import {createHashedContent} from "~/utils/create-hashed-content";
import {createEntryPatch} from "~/utils/create-entry-patch";
import {createHash} from "~/utils/create-hash";
import {Patch} from "generate-json-patch";
import {Params} from "~/logic/types";
import {getRawEntry} from "~/logic/get-raw-entry";
import {upsertRawEntry} from "~/logic/upsert-raw-entry";

export const createEntry = async (data: Params) => {
  const referenceEntry = (await getRawEntry({
    space: data.space,
    environment: data.environment,
    entry: data.raw.sys.id,
    operation: data.operation
  })) ?? getDefaultReferenceEntry(data);
  const source = referenceEntry.raw as EntryProps;
  // @ts-ignore
  const version = data.raw.sys.revision ?? data.raw.sys.version

  console.log(`reference entry version: ${referenceEntry.version}, current version: ${version}`)

  let signature: string
  let patch: Patch = []
  let rawEntry: EntryProps

  if (
    data.operation === 'save' ||
    data.operation === 'auto_save' ||
    data.operation === 'create' ||
    data.operation === 'publish'
  ) {
    const target = data.raw;

    signature = createHashedContent({
      fields: target.fields,
      metadata: target.metadata,
    })

    patch = createEntryPatch({
      fields: source.fields,
      metadata: source.metadata,
    }, {
      fields: target.fields,
      metadata: target.metadata,
    });
    rawEntry = target;
  } else {
    signature = createHash(data.raw)
    rawEntry = source;
  }

  // todo: make it a transaction
  await upsertRawEntry({...data, version, raw: rawEntry})

  return db.insert(entries).values({
    version: version,
    space: data.space,
    environment: data.environment,
    entry: data.raw.sys.id,
    operation: data.operation,
    byUser: data.byUser,
    patch: patch,
    signature
  }).returning().execute();
}

function getDefaultReferenceEntry(data: Params): SelectRawEntry {
  console.log('create default reference entry')
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