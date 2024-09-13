import {EntryProps} from "contentful-management";
import {db} from "~/database";
import {entries} from "~/database/schema";
import {and, desc, eq, inArray} from "drizzle-orm";
import {streamKeyForOperation, Streams} from "~/logic/streams";
import {createHashedContent} from "~/utils/create-hashed-content";
import {createEntryPatch} from "~/utils/create-entry-patch";
import {createHash} from "~/utils/create-hash";
import {Patch} from "generate-json-patch";

type Params = {
  space: string,
  environment: string,
  byUser: string
} & (
  {
    operation: 'save' | 'auto_save' | 'create' |  'publish',
    raw: EntryProps
  } | {
  operation: 'archive' | 'unarchive' | 'delete' | 'unpublish',
  raw: {sys: EntryProps['sys']},
}
  )

export const createEntry = async (data: Params) => {
  const referenceEntry = (await getReferenceEntry(data)) ?? getDefaultReferenceEntry(data);
  const source = referenceEntry.raw_entry as EntryProps;
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

  return db.insert(entries).values({
    version: version,
    space: data.space,
    environment: data.environment,
    raw_entry: rawEntry,
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
    raw_entry: {...data.raw, fields: {}, metadata: {tags: []}}
  }
}

async function getReferenceEntry(data: Params) {
  if (data.operation === 'create') {
    return Promise.resolve(getDefaultReferenceEntry(data));
  }

  const stream = streamKeyForOperation(data.operation);

  const result = await db
    .select()
    .from(entries).where(
      and(
        eq(entries.space, data.space),
        eq(entries.environment, data.environment),
        eq(entries.entry, data.raw.sys.id),
        inArray(entries.operation, Streams[stream]),
      )
    )
    .orderBy(desc(entries.createdAt))
    .limit(1).execute()

  return result[0];
}