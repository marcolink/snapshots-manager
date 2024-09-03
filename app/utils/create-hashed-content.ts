import {EntryProps} from "contentful-management";
import {createHash} from "~/utils/create-hash";
import {HashableContent} from "~/validations/hashable-content";

export function createHashedContent(content: {
  fields: EntryProps['fields'],
  metadata: EntryProps['metadata'],
}) {
  const parsedContent = HashableContent.parse(content)
  return createHash(parsedContent)
}