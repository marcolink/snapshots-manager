import {db} from "~/database";
import {and, eq} from "drizzle-orm";
import {EntryTable} from "~/database/schema";
import {WebhookActions} from "~/types";
import {streamKeyForOperation} from "~/client/streams";

export async function getRawEntry(data: {
  space: string,
  environment: string,
  entry: string,
  operation: WebhookActions
}) {
  const result = await db
    .select()
    .from(EntryTable)
    .where(
      and(
        eq(EntryTable.space, data.space),
        eq(EntryTable.environment, data.environment),
        eq(EntryTable.entry, data.entry),
        eq(EntryTable.stream, streamKeyForOperation(data.operation)),
      ),
    )
    .limit(1);

  return result[0] || null;
}