import {z} from "zod";
import {StreamKeyType, WebhookEvent} from "~/shared/types";

export const StreamKeys = {
  publish: 'publish',
  draft: 'draft'
} as const

export const Streams: Record<StreamKeyType, WebhookEvent[]> = {
  publish: ["create", "publish", "unpublish", "archive", "unarchive", "delete"],
  draft: ["create", 'auto_save', 'save', 'delete']
} as const

export const WebhookVersionEvent = ['publish', 'unpublish'] as const;
export const WebhookNoPatchEvent = ['archive', 'unarchive', 'unpublish', 'delete'] as const;

export function streamKeyForOperation(operation: WebhookEvent): keyof typeof StreamKeys {
  if(isPublishStream(operation)) {
    return StreamKeys.publish
  } else if(Streams.draft.includes(operation)) {
    return StreamKeys.draft
  }

  throw new Error(`Unknown operation ${operation}`)
}

export const StreamKeyDec = z.union([z.literal(StreamKeys.publish), z.literal(StreamKeys.draft)])

export const isPublishStream = (key: WebhookEvent): boolean => Streams.publish.includes(key)