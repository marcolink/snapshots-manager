import {store} from "~/store";
import {and, eq} from "drizzle-orm";
import {EntryTable} from "~/store/schema";
import {WebhookEvent} from "~/types";
import {streamKeyForOperation} from "~/client/streams";

export async function getRawEntry(data: {
  space: string,
  environment: string,
  entry: string,
  operation: WebhookEvent
}) {
  const result = await store
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