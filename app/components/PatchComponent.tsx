import {Operation, Patch} from "generate-json-patch";
import {TagOrConceptValidation} from "~/validations/contentful";
import {Badge, BadgeVariant} from "@contentful/f36-badge";
import {isContentfulAssetLink, isContentfulEntryLink} from "~/utils/is-contentful-link";
import {AssetIcon, EntryIcon} from "@contentful/f36-icons";
import {SectionHeading} from "@contentful/f36-typography";
import {List} from "@contentful/f36-list";
import {ReactNode} from "react";
import {z} from "zod";
import {Tooltip} from "@contentful/f36-tooltip";

export function PatchComponent({patch, locales = []}: { patch: Patch, locales?: string[] }) {
  // lazy mofo - make it reduce
  const fieldPatch = patch
    .filter(operation => operation.path.startsWith('/fields'))
    .flatMap((operation) => createFieldChange(operation, locales))
  const metadataPatch = patch
    .filter(operation => operation.path.startsWith('/metadata'))
    .flatMap(createMetadataChange)

  return (
    <>
      {Boolean(fieldPatch.length) && (
        <>
          <SectionHeading marginTop={'spacingS'} marginBottom={'spacingXs'}>Fields</SectionHeading>
          <List>
            {renderFields(fieldPatch)}
          </List>
        </>
      )}

      {Boolean(metadataPatch.length) && (
        <>
          <SectionHeading marginTop={'spacingS'} marginBottom={'spacingXs'}>Metadata</SectionHeading>
          <List>
            {renderMetadata(metadataPatch)}
          </List>
        </>
      )}
    </>
  )
}

function renderMetadata(patch: FieldChange[]): ReactNode[] {
  const list = []
  for (const change of patch) {
    // console.log(change)
    const field = (
      <Tooltip placement={'top'} key={JSON.stringify(change)} content={`${change.changeTpe} field ${change.field}`}>
        <Badge variant={badgeVariant(change.changeTpe)}>
          {change.field}
        </Badge>
      </Tooltip>
    )

    switch (change.changeTpe) {
      case 'add':
      case 'replace':
      case 'move':
        list.push(<List.Item key={JSON.stringify(change)}>{field} <i>"{JSON.stringify(change.value)}"</i></List.Item>)
        break
      case 'remove':
        list.push(<List.Item key={JSON.stringify(change)}>{field}</List.Item>)
        break
    }
  }
  return list
}

function renderFields(patch: FieldChange[]): ReactNode[] {
  const list = []

  for (const change of patch) {
    // console.log(change)
    const field = (
      <Tooltip placement={'top'} key={JSON.stringify(change)} content={`${change.changeTpe} field ${change.field}`}>
        <Badge variant={badgeVariant(change.changeTpe)}>
          {change.field}
        </Badge>
      </Tooltip>
    )
    const locale = change.locale
    switch (change.changeTpe) {
      case 'add':
      case 'replace':
        list.push(<List.Item
          key={JSON.stringify(change)}>{field} ({locale}): <i>{printValue(change.value)}</i></List.Item>)
        break
      case 'remove':
        list.push(<List.Item key={JSON.stringify(change)}>{field} ({locale})</List.Item>)
        break
    }
  }
  return list
}

export type FieldChange = {
  changeTpe: Operation['op']
  locale?: string,
  field: string,
  value: string | null
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

export function createFieldChange(operation: Operation, locales: string[] = []): FieldChange[] {
  const fieldSegments = operation.path.split('/')
  const field = fieldSegments[2]

  let locale = 'all'

  if (fieldSegments.length > 3) {
    locale = fieldSegments[3]
  }
  if (!isValueOperation(operation)) {
    return [{
      field,
      locale,
      value: null,
      changeTpe: operation.op
    }]
  }

  if (locales.length > 0 && typeof operation.value === 'object') {
    const patchLocales = Object.keys(operation.value).filter(locale => locales.includes(locale))
    return patchLocales.map(locale => {
      const value = typeof operation.value === 'string' ? operation.value : operation.value[locale]
      return {field, locale, value, changeTpe: operation.op}
    })
  }

  return [{
    field,
    locale,
    value: operation.value,
    changeTpe: operation.op
  }]
}

export type MetadataChange = {
  changeTpe: Operation['op']
  locale?: string,
  field: string,
  value: string | null
}

export function createMetadataChange(operation: Operation): MetadataChange[] {
  const fieldSegments = operation.path.split('/')
  const field = fieldSegments[2]
  let value = null

  if (!isValueOperation(operation)) {
    return [{
      field,
      value,
      changeTpe: operation.op
    }]
  }

  if (operation.op === 'add' && Array.isArray(operation.value) && operation.value.length === 0) {
    return [{
      field,
      value: 'initialized',
      changeTpe: operation.op
    }]
  }

  function ensureStringValue(value: any) {
    if (typeof value === 'string') {
      return value
    }
    if (Array.isArray(value)) {
      const {success} = z.array(TagOrConceptValidation).safeParse(value)
      console.log({success, value})

      if (success) {
        return value.map(link => link.sys.id).join(', ')
      }
    }
    if (typeof value === 'object') {
      return JSON.stringify(value)
    }
    return JSON.stringify(value)
  }

  value = ensureStringValue(operation.value)
  const {data} = TagOrConceptValidation.safeParse(operation.value)

  if (data) {
    value = data.sys.id
  }

  return [{
    field,
    value,
    changeTpe: operation.op
  }]

}

function isValueOperation(operation: Operation): operation is Operation & { value: string } {
  return operation.op === 'add' || operation.op === 'replace' || operation.op === 'copy'
}