import {StreamKeyType, WebhookActions} from "~/types";
import {z} from "zod";

export const StreamKeys = {
  publish: 'publish',
  draft: 'draft'
} as const

export const Streams: Record<StreamKeyType, WebhookActions[]> = {
  publish: ["create", "publish", "unpublish", "archive", "unarchive", "delete"],
  draft: ["create", 'auto_save', 'save', 'delete']
} as const

export function streamKeyForOperation(operation: WebhookActions): keyof typeof StreamKeys {
  if(Streams.publish.includes(operation)) {
    return StreamKeys.publish
  } else if(Streams.draft.includes(operation)) {
    return StreamKeys.draft
  }

  throw new Error(`Unknown operation ${operation}`)
}

export const StreamKeyDec = z.enum([Object.keys(StreamKeys) as unknown as StreamKeyType])