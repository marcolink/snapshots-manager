import {formatRelativeDateTime} from "@contentful/f36-datetime";
import {EntryData, WebhookActions} from "~/types";
import {UserProps} from "contentful-management";
import {Card} from "@contentful/f36-card";
import {OperationBadge} from "~/components/OperationBadge";
import {User} from "~/components/User";
import {Operation, Patch} from "generate-json-patch";
import {SectionHeading} from "@contentful/f36-typography";
import {ReactNode} from "react";
import {Badge, BadgeVariant} from "@contentful/f36-badge";
import {List, ListItem} from "@contentful/f36-list";
import {ArrowDownwardIcon, ArrowUpwardIcon, AssetIcon, EditIcon, EntryIcon, PlusIcon} from "@contentful/f36-icons";
import {isContentfulAssetLink, isContentfulEntryLink} from "~/utils/is-contentful-link";
import {printVersion} from "~/utils/change-version";
import {Timeline} from "~/components/Timeline";
import {createFieldChange, FieldChange} from "~/components/PatchComponent";

type Data = EntryData & { user?: UserProps }

const detailOperations: WebhookActions[] = ['publish', 'save', 'auto_save', 'create']

export function Changelog({entries, isLoadingUsers, locales}: { entries: Data[], isLoadingUsers?: boolean, locales?: string[] }) {
  return (
    <div style={{minWidth: '900px', width: '90%'}}>
      <Timeline
        entries={entries}
        getKey={(entry) => entry.id.toString()}
        iconRenderer={(entry) => {
          if (['auto_save', 'save'].includes(entry.operation)) {
            return {component: <EditIcon variant={'primary'}/>, className: 'bg-blue-200'}
          }
          if (entry.operation === 'publish') {
            return {component: <ArrowUpwardIcon variant={'positive'}/>, className: 'bg-green-200'}
          }
          if (entry.operation === 'unpublish') {
            return {component: <ArrowDownwardIcon variant={'negative'}/>, className: 'bg-gray-200'}
          }
          if (entry.operation === 'create') {
            return {component: <PlusIcon variant={'positive'}/>, className: 'bg-white'}
          }
          return {component: <EditIcon variant={'primary'}/>, className: 'bg-gray-200'}
        }}
        itemRenderer={(entry) => (
          <ChangelogEntry
            entry={entry}
            isLoadingUsers={isLoadingUsers}
            isProd={false}
            isPrev={false}
          />
        )}
      />
    </div>
  );
}

function ChangelogEntry({entry, isLoadingUsers, isProd, isPrev}: {
  entry: Data,
  isProd: boolean,
  isPrev: boolean,
  isLoadingUsers?: boolean
}) {
  let additionalBadge = null
  if (isProd) {
    additionalBadge = <Badge variant={'warning'} className={'mr-1'}>Production</Badge>
  } else if (isPrev) {
    additionalBadge = <Badge variant={'warning'} className={'mr-1'}>Preview</Badge>
  }

  return (
    <Card
      className={'overflow-clip'}
      badge={<>{additionalBadge}<OperationBadge operation={entry.operation}/></>}
      key={`${entry.id} ${entry.operation}`}
      title={`${printVersion(entry)} - ${formatRelativeDateTime(entry.createdAt)}`}
    >
      <User user={entry.user} isLoading={isLoadingUsers}/>
      {detailOperations.includes(entry.operation as WebhookActions) && <SnapshotContent entry={entry}/>}
    </Card>
  )
}

function SnapshotContent({entry}: { entry: EntryData }) {
  const renderedPatch = renderFieldsPatch(entry.patch as Patch)

  if (renderedPatch.length === 0) {
    return null
  }

  return (
    <>
      <SectionHeading>Fields</SectionHeading>
      <List>
        {renderedPatch.map((patch, index) => <ListItem key={index}>{patch}</ListItem>)}
      </List>
    </>)
}

function filterFieldPatch(patch: Patch): FieldChange[] {
  return patch.filter((operation) => {
    return operation.path.startsWith('/fields')
  }).flatMap((operation) => createFieldChange(operation, ['en-US', 'de']))
}

function printValue(value: any) {
  if (isContentfulEntryLink(value)) {
    return <i><EntryIcon/> {value.sys.id}</i>
  }
  if (isContentfulAssetLink(value)) {
    return <i><AssetIcon/> {value.sys.id}</i>
  }
  if (Array.isArray(value)) {
    return <>{value.map(value => `"${value}"`).join(', ')}</>
  }
  if (typeof value === 'object') {
    return <pre>{JSON.stringify(value, null, 2)}</pre>
  }
  return <i>"{value}"</i>
}

function badgeVariant(changeType: Operation['op']): BadgeVariant {
  switch (changeType) {
    case 'add':
      return 'positive'
    case 'replace':
      return 'primary'
    case 'remove':
      return 'negative'
    case 'move':
      return 'warning'
    default:
      console.log('unknown change type', changeType)
      return 'primary'
  }
}

function renderFieldsPatch(patch: Patch): ReactNode[] {
  const list = []
  const fieldChanges = filterFieldPatch(patch)

  for (const change of fieldChanges) {
    // console.log(change)
    const field = <Badge variant={badgeVariant(change.changeTpe)}>{change.field}</Badge>
    const locale = change.locale
    switch (change.changeTpe) {
      case 'add':
        list.push(<>{field} ({locale}): {printValue(change.value)}</>)
        break
      case 'replace':
        list.push(<>{field} ({locale}): {printValue(change.value)}</>)
        break
      case 'remove':
        list.push(<>{field} <b>{locale}</b></>)
        break
    }
  }
  return list
}