import {formatRelativeDateTime} from "@contentful/f36-datetime";
import {EntryData} from "~/types";
import {UserProps} from "contentful-management";
import {Card} from "@contentful/f36-card";
import {Stack} from "@contentful/f36-core";
import {OperationBadge} from "~/components/OperationBadge";
import {User} from "~/components/User";
import {Operation, Patch} from "generate-json-patch";
import {Subheading} from "@contentful/f36-typography";
import {ReactNode} from "react";
import {Badge, BadgeVariant} from "@contentful/f36-badge";
import {List, ListItem} from "@contentful/f36-list";

type Data = EntryData & { user?: UserProps }

function transformX(index: number) {
  return {transform: `translateX(${(index % 2 ? 1 : -1) * 52}%)`}
}

function V1({entries}: { entries: Data[] }) {

  return (
    <Stack flexDirection={'column'} alignItems="center">
      {entries.map((entry, index) => {
        const renderedPatch = renderPatch(entry.patch as Patch)
        return (<Card
          style={{width: '30%', minWidth: '400px', ...transformX(index)}}
          badge={<OperationBadge operation={entry.operation}/>}
          key={entry.id}
          marginBottom={'spacingM'}
          title={`v${entry.version} - ${formatRelativeDateTime(entry.createdAt)}`}
        >
          <User user={entry.user}/>

          <Subheading>Fields</Subheading>
          <List>
            {renderedPatch.map((patch, index) => <ListItem key={index}>{patch}</ListItem>)}
          </List>

        </Card>)
      })}
    </Stack>
  );
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
  if (typeof value === 'object') {
    return <pre>{JSON.stringify(value, null, 2)}</pre>
  }
  return <i>{value}</i>
}


function createFieldChange(operation: Operation): FieldChange {
  const fieldSegments = operation.path.split('/')
  const field = fieldSegments[2]

  if(!Object.hasOwn(operation, 'value')) {
    return {field, locale: '', value: null, changeTpe: operation.op}
  }

  // @ts-ignore
  const locale = fieldSegments.length > 3 ? fieldSegments[3] : Object.keys(operation.value)[0]


  // @ts-ignore
  const value = typeof operation.value === 'string' ? operation.value :  operation.value[locale]

console.log({operationValue: operation.value, value})

  // const locale = fieldSegments.length > 3 ? fieldSegments[3] : Object.keys(operation.value)[0]


  return {field, locale, value, changeTpe: operation.op}

}

function badgeVariant(changeType: Operation['op']):BadgeVariant {
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

function renderPatch(patch: Patch): ReactNode[] {
  const list = []
  const fieldChanges = filterFieldPatch(patch)

  for (const change of fieldChanges) {
    // console.log(change)
    const field =  <Badge variant={badgeVariant(change.changeTpe)}>{change.field}</Badge>
    const locale =  change.locale
    switch (change.changeTpe) {
      case 'add':
        list.push(<>{field} <b>{locale}</b> {printValue(change.value)}</>)
        break
      case 'replace':
        list.push(<>{field} <b>{locale}</b> {printValue(change.value)}</>)
        break
      case 'remove':
        list.push(<>{field} <b>{locale}</b></>)
        break
    }
  }
  return list
}

export const Changelog = V1

