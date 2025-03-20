import {PatchEntryWithUser} from "~/types";
import {Text} from "@contentful/f36-typography";
import {Patch} from "generate-json-patch";
import {numberToWords} from "~/utils/number-to-words";
import {createMetadataChange} from "~/utils/patch-utils";

const pluralize = (word: string, count: number) => count === 1 ? word : `${word}s`

export function operationsText(entry: PatchEntryWithUser, locales: string[] = []) {
  const patch = entry.patch as Patch

  const fieldChanges = patch
    .filter(operation => operation.path.startsWith('/fields'))

  const metadataPatch = patch
    .filter(operation => operation.path.startsWith('/metadata'))
    .flatMap(createMetadataChange)


  const changes = []
  const name = <strong>{entry.user?.firstName || "Unknown"}</strong>
    if(fieldChanges.length > 0) {
      changes.push(`${numberToWords(fieldChanges.length)} ${pluralize('field', fieldChanges.length)}`)
    }
  if (metadataPatch.some(change => change.field === 'tags')) {
    changes.push('tags')
  }
  if (metadataPatch.some(change => change.field === 'concepts')) {
    changes.push('concepts')
  }

  const changeString = concatenateWords(changes)

  switch (entry.operation) {
    case 'create':
      return <Text>{name} created a new entry</Text>
    case 'save':
    case 'auto_save':
      return <Text>{name} changed {changeString}</Text>
    case 'publish':
      return <Text>{name} published {changes.length ? `${changeString} ${pluralize('change', fieldChanges.length + metadataPatch.length)}` : 'without changes'}</Text>
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

function concatenateWords(words: string[]) : string {
  if (!Array.isArray(words)) {
    throw new TypeError('Input must be an array of words.');
  }

  const length = words.length;

  if (length === 0) {
    return '';
  } else if (length === 1) {
    return words[0];
  } else if (length === 2) {
    return `${words[0]} and ${words[1]}`;
  } else {
    const allButLast = words.slice(0, -1).join(', ');
    const lastWord = words[length - 1];
    return `${allButLast} and ${lastWord}`;
  }
}