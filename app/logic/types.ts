import {EntryProps} from "contentful-management";

export type Params = {
  space: string,
  environment: string,
  byUser: string
} & (
  {
    operation: 'save' | 'auto_save' | 'create' | 'publish',
    raw: EntryProps
  } | {
  operation: 'archive' | 'unarchive' | 'delete' | 'unpublish',
  raw: { sys: EntryProps['sys'] },
}
  )