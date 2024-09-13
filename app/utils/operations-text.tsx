import {EntryDataWithUser} from "~/types";
import {Text} from "@contentful/f36-typography";
import {Patch} from "generate-json-patch";
import {numberToWords} from "~/utils/number-to-words";

const pluralize = (word: string, count: number) => count === 1 ? word : `${word}s`

export function operationsText(entry: EntryDataWithUser) {
  const patch = entry.patch as Patch

  const name = <strong>{entry.user?.firstName || "Unknown"}</strong>

  switch (entry.operation) {
    case 'create':
      return <Text>{name} created a new entry</Text>
    case 'save':
    case 'auto_save':
      return <Text>{name} changed {numberToWords(patch.length)} {pluralize('field', patch.length)}</Text>
    case 'publish':
      return <Text>{name} published the entry</Text>
    case 'archive':
      return <Text>{name} archived the entry</Text>
    case 'delete':
      return <Text>{name} deleted the entry</Text>
    case 'unarchive':
      return <Text>{name} unarchived the entry</Text>
    case 'unpublish':
      return <Text>{name} unpublished the entry</Text>
    default:
      return <Text>{name} performed an unknown action</Text>
  }
}