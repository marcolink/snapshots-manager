import {EntryProps} from "contentful-management";
import {db} from "~/database";
import {entries, signature_content} from "~/database/schema";
import {and, desc, eq, inArray} from "drizzle-orm";
import {generateJSONPatch} from "generate-json-patch";
import {WebhookActions} from "~/types";
import {streamKeyForOperation, Streams} from "~/logic/streams";
import {createHashedContent} from "~/utils/create-hased-content";

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

  console.time('hash')
  const hashed = createHashedContent({
    fields: target.fields,
    metadata: target.metadata,
  })
  console.timeEnd('hash')

  return db.transaction(async (trx) => {
    const existingHash = await trx.select({signature: signature_content.signature}).from(signature_content)
      .where(eq(signature_content.signature, hashed.signature))
      .limit(1)
      .execute();

    if (existingHash.length === 0) {
      console.log('Inserting new hash', hashed.signature)
      await trx.insert(signature_content).values({
        signature: hashed.signature,
        data: hashed.content,
        space: data.space,
      })
    } else {
      console.log('Hash already exists', hashed.signature)
    }

    return trx.insert(entries).values({
      // @ts-ignore
      version: data.raw.sys.revision || data.raw.sys.version,
      space: data.space,
      environment: data.environment,
      raw_entry: data.raw,
      entry: data.raw.sys.id,
      operation: data.operation,
      byUser: data.byUser,
      patch: patch,
      signature: hashed.signature
    }).returning().execute();
  })
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