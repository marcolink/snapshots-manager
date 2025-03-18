import {db} from "~/database";
import {and, desc, eq} from "drizzle-orm";
import {rawEntries} from "~/database/schema";
import {WebhookActions} from "~/types";
import {streamKeyForOperation} from "~/logic/streams";

export async function getRawEntry(data: {
  space: string,
  environment: string,
  entry: string,
  operation: WebhookActions
}) {
  const result = await db
    .select()
    .from(rawEntries)
    .where(
      and(
        eq(rawEntries.space, data.space),
        eq(rawEntries.environment, data.environment),
        eq(rawEntries.entry, data.entry),
        eq(rawEntries.stream, streamKeyForOperation(data.operation)),
      ),
    )
    .limit(1);

  return result[0] || null;
}