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

export const VersionActions = ['publish', 'unpublish'];

export const NoPatchActions = ['archive', 'unarchive', 'unpublish', 'delete'];

export function streamKeyForOperation(operation: WebhookActions): keyof typeof StreamKeys {
  if(isPublishStream(operation)) {
    return StreamKeys.publish
  } else if(Streams.draft.includes(operation)) {
    return StreamKeys.draft
  }

  throw new Error(`Unknown operation ${operation}`)
}

export const StreamKeyDec = z.union([z.literal(StreamKeys.publish), z.literal(StreamKeys.draft)])

export const isPublishStream = (key: WebhookActions): boolean => Streams.publish.includes(key)