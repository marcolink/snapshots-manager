import {formatRelativeDateTime} from "@contentful/f36-datetime";
import {EntryData, WebhookActions} from "~/types";
import {UserProps} from "contentful-management";
import {Card} from "@contentful/f36-card";
import {Stack} from "@contentful/f36-core";
import {OperationBadge} from "~/components/OperationBadge";
import {User} from "~/components/User";
import {Operation, Patch} from "generate-json-patch";
import {SectionHeading} from "@contentful/f36-typography";
import {ReactNode} from "react";
import {Badge, BadgeVariant} from "@contentful/f36-badge";
import {List, ListItem} from "@contentful/f36-list";
import {AssetIcon, EntryIcon} from "@contentful/f36-icons";
import {isContentfulAssetLink, isContentfulEntryLink} from "~/utils/is-contentful-link";

type Data = EntryData & { user?: UserProps }

function transformX(index: number) {
  return {transform: `translateX(${(index % 2 ? 1 : -1) * 52}%)`}
}

const detailOperations: WebhookActions[] = ['publish', 'save', 'auto_save', 'create']

function V1({entries, isLoadingUsers}: { entries: Data[], isLoadingUsers?: boolean }) {

  return (
    <Stack flexDirection={'column'} alignItems="center">
      {entries.map((entry, index) => {
        return (<Card
          // style={{width: '40%', minWidth: '480px', ...transformX(index)}}
          style={{width: '40%', minWidth: '480px'}}
          badge={<OperationBadge operation={entry.operation}/>}
          key={`${entry.id} ${entry.operation}`}
          marginBottom={'spacingM'}
          title={`v${entry.version} - ${formatRelativeDateTime(entry.createdAt)}`}
        >
          <User user={entry.user} isLoading={isLoadingUsers}/>
          {detailOperations.includes(entry.operation as WebhookActions) && <SnapshotContent entry={entry}/>}
        </Card>)
      })}
    </Stack>
  );
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

type FieldChange = {
  changeTpe: Operation['op']
  locale?: string,
  field: string,
  value: string | null
}

function filterFieldPatch(patch: Patch): FieldChange[] {
  return patch.filter((operation) => {
    return operation.path.startsWith('/fields')
  }).map(createFieldChange)
}

function printValue(value: any) {
  if (isContentfulEntryLink(value)) {
    return <i><EntryIcon/> {value.sys.id}</i>
  }
  if (isContentfulAssetLink(value)) {
    return <i><AssetIcon/> {value.sys.id}</i>
  }
  if (typeof value === 'object') {
    return <pre>{JSON.stringify(value, null, 2)}</pre>
  }
  return <i>"{value}"</i>
}

function createFieldChange(operation: Operation): FieldChange {
  const fieldSegments = operation.path.split('/')
  const field = fieldSegments[2]

  if (!Object.hasOwn(operation, 'value')) {
    return {field, locale: '', value: null, changeTpe: operation.op}
  }

  // @ts-ignore
  const locale = fieldSegments.length > 3 ? fieldSegments[3] : Object.keys(operation.value)[0]

  // @ts-ignore
  const value = typeof operation.value === 'string' ? operation.value : operation.value[locale]

  return {field, locale, value, changeTpe: operation.op}
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

export const Changelog = V1

