import {EntryProps} from "contentful-management";
import {db} from "~/database";
import {entries} from "~/database/schema";
import {and, desc, eq, inArray} from "drizzle-orm";
import {generateJSONPatch} from "generate-json-patch";
import {WebhookActions} from "~/types";
import {streamKeyForOperation, Streams} from "~/logic/streams";

type Params = {
  space: string,
  environment: string,
  raw: EntryProps,
  operation: WebhookActions,
  byUser: string
}

export const createEntry = async (data: Params) => {
  const referenceEntry = (await getReferenceEntry(data)) ?? getDefaultReferenceEntry(data);

  const source = referenceEntry.raw_entry as EntryProps;
  const target = data.raw;

  const patch = generateJSONPatch({
    fields: source.fields,
    metadata: source.metadata,
  }, {
    fields: target.fields,
    metadata: target.metadata,
  });

  return db.insert(entries).values({
    // @ts-ignore
    version: data.raw.sys.revision || data.raw.sys.version,
    space: data.space,
    environment: data.environment,
    raw_entry: data.raw,
    entry: data.raw.sys.id,
    operation: data.operation,
    byUser: data.byUser,
    patch: patch,
  }).returning().execute();
}

function getDefaultReferenceEntry(data: Params) {
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
        inArray(entries.operation, Streams[stream]),
      )
    )
    .orderBy(desc(entries.createdAt))
    .limit(1).execute()

  return result[0];

}