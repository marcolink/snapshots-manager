import {Badge, BadgeVariant} from "@contentful/f36-badge";
import {WebhookActions} from "~/types";

export const OperationMap: Record<WebhookActions, BadgeVariant> = {
  auto_save: 'primary',
  save: 'primary',
  create: 'primary-filled',
  archive: 'negative',
  unarchive: 'primary-filled',
  publish: 'positive',
  unpublish: 'negative',
  delete: 'negative',
}

export function OperationBadge({operation}: {operation:string}) {
  let variant: BadgeVariant = 'secondary'
  if (isKnownOperation(operation)) {
    variant = OperationMap[operation]
  }
  return <Badge variant={variant}>{operation}</Badge>
}

function isKnownOperation(operation: string): operation is WebhookActions {
  return operation in OperationMap
}