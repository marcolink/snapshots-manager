import {EntryProps} from "contentful-management";
import {createHash} from "~/utils/create-hash";

export function createHashedContent({metadata, fields}: {
  fields: EntryProps['fields'],
  metadata: EntryProps['metadata'],
}) {
  return {
    signature: createHash(({metadata, fields})),
    content: {metadata, fields}
  }
}