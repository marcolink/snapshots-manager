import {EntryProps} from "contentful-management";

export type WebhookEventPayloadWithData = {
  operation: 'save' | 'auto_save' | 'create' | 'publish',
  raw: EntryProps
}

export type WebhookEventPayloadWithoutData = {
  operation: 'archive' | 'unarchive' | 'delete' | 'unpublish',
  raw: { sys: EntryProps['sys'] },
}

export type WebhookEventPayload = WebhookEventPayloadWithData | WebhookEventPayloadWithoutData

export type BaseParams = {
  space: string,
  environment: string,
  entry: string,
}

export type Params = {
  space: string,
  environment: string,
  byUser: string
} & WebhookEventPayload