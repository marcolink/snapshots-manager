import {EntryDataWithUser, WebhookActions} from "~/types";
import {ArchiveIcon, ArrowDownwardIcon, ArrowUpwardIcon, EditIcon, PlusIcon} from "@contentful/f36-icons";
import {Tooltip} from "@contentful/f36-tooltip";
import {printVersion} from "~/utils/change-version";
import {ConditionalWrapper} from "~/components/ConditionalWrapper";

type Props = { operation: WebhookActions };

const PastAction: Record<WebhookActions, string> = {
  create: 'created',
  auto_save: 'auto saved',
  save: 'saved',
  publish: 'published',
  archive: 'archived',
  delete: 'deleted',
  unarchive: 'unarchived',
  unpublish: 'unpublished'
}

export function OperationIcon({operation}: Props) {
  if (['auto_save', 'save'].includes(operation)) {
    return <EditIcon variant={'primary'}/>
  }
  if (operation === 'publish') {
    return <ArrowUpwardIcon variant={'positive'}/>
  }
  if (operation === 'unpublish') {
    return <ArrowDownwardIcon variant={'negative'}/>
  }
  if (operation === 'create') {
    return <PlusIcon variant={'positive'}/>
  }
  if (operation === 'archive') {
    return <ArchiveIcon variant={'negative'}/>
  }
  if (operation === 'unarchive') {
    return <ArchiveIcon variant={'primary'}/>
  }
  return <EditIcon variant={'primary'}/>
}

export function operationBackgroundColorClass(operation: WebhookActions) {
  if (['auto_save', 'save'].includes(operation)) {
    return 'bg-blue-200'
  }
  if (operation === 'publish') {
    return 'bg-green-200'
  }
  if (operation === 'unpublish') {
    return 'bg-gray-200'
  }
  if (operation === 'create') {
    return 'bg-white'
  }
  if (operation === 'unarchive') {
    return 'bg-blue-200'
  }
  return 'bg-gray-200'
}

export function renderOperationIcon(entry: EntryDataWithUser, tooltip: boolean = false) {
  const tooltipContent = `${PastAction[entry.operation]} ${printVersion(entry)}`
  const component = (
    <ConditionalWrapper
      condition={tooltip}
      wrapper={children => <Tooltip content={tooltipContent}>{children}</Tooltip>}>
      <OperationIcon operation={entry.operation}/>
    </ConditionalWrapper>
  )

  return {
    component: component,
    className: operationBackgroundColorClass(entry.operation)
  }
}