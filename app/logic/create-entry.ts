import {EntryProps} from "contentful-management";
import {db} from "~/database";
import {entries} from "~/database/schema";
import {WebhookActions} from "~/types";
import {streamKeyForOperation} from "~/logic/streams";
import {createHashedContent} from "~/utils/create-hashed-content";
import {createEntryPatch} from "~/utils/create-entry-patch";
import {getReferenceEntry} from "~/logic/get-reference-entry";
import {getEntriesInPatchableRange} from "./get-entries-in-patchable-range";
import {applyEntryPatch} from "~/utils/apply-entry-patch";
import {Patch} from "generate-json-patch";

type Params = {
  space: string,
  environment: string,
  raw: EntryProps,
  operation: WebhookActions,
  byUser: string
}

export const createEntry = async (data: Params) => {

  const existingReferenceEntry = (
    await getReferenceEntry({
      space: data.space,
      environment: data.environment,
      entry: data.raw.sys.id,
      stream: streamKeyForOperation(data.operation)
    })
  )[0]

  const referenceEntry = existingReferenceEntry ?? getDefaultReferenceEntry(data);

  let source = referenceEntry.raw_entry as EntryProps;
  const target = data.raw;
  // @ts-ignore
  const version = data.raw.sys.revision ?? data.raw.sys.version

  const patchableRangeEntries = await getEntriesInPatchableRange({
    space: data.space,
    environment: data.environment,
    entry: data.raw.sys.id,
    stream: streamKeyForOperation(data.operation)
  })

  let referenceRaw = patchableRangeEntries.pop()?.raw_entry as EntryProps

  if (referenceRaw) {
    console.log('patchable range has raw')
    console.log(referenceRaw)
    source = applyEntryPatch({
      entry: referenceRaw,
      patches: patchableRangeEntries
        .reverse()
        .map((entry) => entry.patch as Patch)
    })
  }

  // write a test where we create multiple entries and check if the patchable range is correct
  // console.log(patchableRangeEntries)

  console.log(`reference entry version: ${referenceEntry.version}, current version: ${version}`)

  console.time('create signature')
  const signature = createHashedContent({
    fields: target.fields,
    metadata: target.metadata,
  })
  console.timeEnd('create signature')

  console.time('create patch')
  const patch = createEntryPatch({
    fields: source.fields,
    metadata: source.metadata,
  }, {
    fields: target.fields,
    metadata: target.metadata,
  });

  console.timeEnd('create patch')

  console.log(`${data.raw.sys.id}`, {existingReferenceEntry: Boolean(existingReferenceEntry)})

  return db.insert(entries).values({
    version: version,
    space: data.space,
    environment: data.environment,
    raw_entry: existingReferenceEntry ? null : data.raw,
    entry: data.raw.sys.id,
    operation: data.operation,
    byUser: data.byUser,
    patch: patch,
    signature
  }).returning().execute();
}

function getDefaultReferenceEntry(data: Params) {
  console.log('create default reference entry')
  return {
    createdAt: new Date(),
    patch: [],
    id: 0,
    entry: data.raw.sys.id,
    version: 0,
    space: data.space,
    environment: data.environment,
    operation: data.operation,
    byUser: data.raw.sys.createdBy?.sys.id ?? 'unknown',
    raw_entry: {...data.raw, fields: {}, metadata: {}}
  }
}

//
// async function getReferenceEntry(data: Params) {
//   if (data.operation === 'create') {
//     return Promise.resolve(getDefaultReferenceEntry(data));
//   }
//
//   const stream = streamKeyForOperation(data.operation);
//
//   const result = await db
//     .select()
//     .from(entries).where(
//       and(
//         eq(entries.space, data.space),
//         eq(entries.environment, data.environment),
//         eq(entries.entry, data.raw.sys.id),
//         inArray(entries.operation, Streams[stream]),
//       )
//     )
//     .orderBy(desc(entries.createdAt))
//     .limit(1).execute()
//
//   return result[0];
//
// }