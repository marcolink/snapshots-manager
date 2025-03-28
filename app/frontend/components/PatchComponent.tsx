import {Operation, Patch} from "generate-json-patch";
import {LooseRichTextFieldValidation, TagOrConceptValidation} from "~/validations/contentful";
import {Badge, BadgeVariant} from "@contentful/f36-badge";
import {isContentfulAssetLink, isContentfulEntryLink} from "~/utils/is-contentful-link";
import {AssetIcon, DeleteIcon, EntryIcon, TagsIcon} from "@contentful/f36-icons";
import {SectionHeading} from "@contentful/f36-typography";
import {List} from "@contentful/f36-list";
import {ReactNode} from "react";
import {Tooltip} from "@contentful/f36-tooltip";
import {documentToReactComponents} from "@contentful/rich-text-react-renderer";
import {createFieldChange, createMetadataChange, MetadataChange} from "~/frontend/utils/patch-utils";
import {z} from "zod";
import {Document} from "@contentful/rich-text-types";

export function PatchComponent({patch, locales = []}: { patch: Patch, locales?: string[] }) {
  // lazy mofo - make it reduce
  const fieldPatch = patch
    .filter(operation => operation.path.startsWith('/fields'))
  const fieldChanges = fieldPatch.flatMap((operation) => createFieldChange(operation, locales))

  const metadataPatch = patch
    .filter(operation => operation.path.startsWith('/metadata'))
    .flatMap(createMetadataChange)

  return (
    <>
      {Boolean(fieldChanges.length) && (
        <>
          <SectionHeading marginTop={'spacingS'} marginBottom={'spacingXs'}>Fields</SectionHeading>
          <List>
            {renderFields(fieldChanges)}
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

function renderMetaDataLinks(value: unknown) {

  const {data, success} = z.array(TagOrConceptValidation).safeParse(value)
  if(!success) {
    return JSON.stringify(value)
  }

  if(data.length === 0) {
    return <DeleteIcon/>
  }

  return (
    <ul>
      {data.map(({sys}) => (
        <li key={sys.id}>
          {sys.linkType === 'Tag' ? <TagsIcon/> : <EntryIcon/>} <code>{sys.id}</code>
        </li>
      ))}
    </ul>
  )
}

function renderMetadata(patch: MetadataChange[]): ReactNode[] {
  const list = []
  for (const change of patch) {
    // console.log(change)
    const field = (
      <Tooltip placement={'top'} key={JSON.stringify(change)} content={`${change.operation} field ${change.field}`}>
        <Badge variant={badgeVariant(change.operation)}>
          {change.field}
        </Badge>
      </Tooltip>
    )

    switch (change.operation) {
      case 'add':
      case 'replace':
      case 'move':
        list.push(<List.Item key={JSON.stringify(change)}>{field} {renderMetaDataLinks(change.value)}</List.Item>)
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
      <Tooltip placement={'top'} key={JSON.stringify(change)} content={`${change.operation} field ${change.field}`}>
        <Badge variant={badgeVariant(change.operation)}>
          {change.field}
        </Badge>
      </Tooltip>
    )
    const locale = change.locale
    switch (change.operation) {
      case 'add':
      case 'replace':
        list.push(<List.Item
          key={JSON.stringify(change)}>{field} ({locale})<br/><i>{printValue(change.value)}</i></List.Item>)
        break
      case 'remove':
        list.push(<List.Item key={JSON.stringify(change)}>{field}<br/>({locale})</List.Item>)
        break
    }
  }
  return list
}

export type FieldChange = {
  operation: Operation['op']
  locale?: string,
  field: string,
  value: string | null
}

function printValue(value: unknown) {
  if (Array.isArray(value)) {

    if(value.filter(v => isContentfulEntryLink(v) || isContentfulAssetLink(v)).length > 0) {
      return value.map(v => {
        const icon = v.sys.linkType === 'Entry' ? <EntryIcon/> : <AssetIcon/>
        return <i key={v.sys.id}>{icon} {v.sys.id}</i>
      })
    }

    return <>{value.map(value => `"${value}"`).join(', ')}</>
  }

  if (isContentfulEntryLink(value)) {
    return <i><EntryIcon/> {value.sys.id}</i>
  }
  if (isContentfulAssetLink(value)) {
    return <i><AssetIcon/> {value.sys.id}</i>
  }

  const {success: isRichText} = LooseRichTextFieldValidation.safeParse(value)
  if (isRichText) {
    return documentToReactComponents(value as Document)
  }
  if (typeof value === 'object') {
    return <pre>{JSON.stringify(value, null, 2)}</pre>
  }
  return <i>{`"${value}"`}</i>
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
