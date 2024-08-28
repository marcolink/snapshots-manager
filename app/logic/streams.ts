import {WebhookActions} from "~/types";

export const operationStreams: Record<string, WebhookActions[]> = {
  publish: ["create", "publish", "unpublish", "archive", "unarchive", "delete"],
  update: ["create", 'auto_save', 'save', 'delete']
} as const

export type OperationStreams = keyof typeof operationStreams