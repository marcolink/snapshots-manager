import {EntryProps} from "contentful-management";
import {db} from "~/database";
import {entries} from "~/database/schema";
import {and, desc, eq} from "drizzle-orm";
import {generateJSONPatch, Patch} from "generate-json-patch";

export const createEntry = async (
  data: {
    space: string,
    environment: string,
    raw: EntryProps,
    operation: string,
    byUser: string
  }
) => {

  // const s = await db.query.entries.findFirst({
  //   where: and(
  //     eq(entries.space, data.space),
  //     eq(entries.environment, data.environment)
  //   )})

  const storedEntries = await db
    .select()
    .from(entries)
    .where(
      and(
        eq(entries.space, data.space),
        eq(entries.environment, data.environment)
      )
    )
    .orderBy(desc(entries.createdAt))
    .limit(1);

  console.log({storedEntries})

  let patch: Patch = []

  if (storedEntries.length > 0) {
    const source = storedEntries[0].raw_entry as EntryProps;
    const target = data.raw;
    patch = generateJSONPatch(source, target);
    console.log({patch})
  } else {
    console.log('No stored entries found')
  }

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
  }).execute();
}

type GetEntriesParams = {
  q: {
    space?: string,
    environment?: string,
    entry?: string,
  }
  limit: number
}

export const getEntries = async ({q, limit = 100}: GetEntriesParams) => {

  console.log(q)

  const query = db
    .select()
    .from(entries)
    .limit(limit)
    .orderBy(desc(entries.createdAt))

  if (q) {
    query.where(
      and(
        q.space ? eq(entries.space, q.space) : undefined,
        q.environment ? eq(entries.environment, q.environment) : undefined,
        q.entry ? eq(entries.entry, q.entry) : undefined,
      )
    )
  }

  return query.execute();
}
