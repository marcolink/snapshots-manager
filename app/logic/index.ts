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
    operation: string
  }
) => {
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

  if(storedEntries.length > 0) {
    const source = storedEntries[0].raw_entry as EntryProps;
    const target = data.raw;
    patch = generateJSONPatch(source, target);
    console.log({patch})
  } else {
    console.log('No stored entries found')
  }

  return db.insert(entries).values({
    // @ts-ignore
    version: data.raw.sys.revision,
    space: data.space,
    environment: data.environment,
    raw_entry: data.raw,
    operation: data.operation,
    patch: patch
  }).execute();
}