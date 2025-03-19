import {EntryProps} from "contentful-management";
import {db} from "~/database";
import {PatchTable, SelectEntry} from "~/database/schema";
import {streamKeyForOperation} from "./../streams";
import {createEntryPatch} from "~/utils/create-entry-patch";
import {Patch} from "generate-json-patch";
import {Params} from "./../types";
import {getRawEntry} from "../entry/get-raw-entry";
import {upsertRawEntry} from "../entry/upsert-raw-entry";

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

  // for operations that provide an entry payload, we can create a patch
  if (
    data.operation === 'save' ||
    data.operation === 'auto_save' ||
    data.operation === 'create' ||
    data.operation === 'publish'
  ) {
    const target = data.raw;
    patch = createEntryPatch(source, target)
    rawEntry = target;
  }

  return db.transaction(async (tx) => {
    await upsertRawEntry({...data, version, raw: rawEntry}, tx)
    return tx.insert(PatchTable).values({
      version: version,
      space: data.space,
      environment: data.environment,
      entry: data.raw.sys.id,
      operation: data.operation,
      byUser: data.byUser,
      patch: patch,
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