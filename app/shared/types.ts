import {EntryProps, UserProps} from "contentful-management";
import {StreamKeys, Streams} from "~/shared/streams";
import {Jsonify} from "@remix-run/server-runtime/dist/jsonify";
import {SelectPatch} from "~/backend/store/schema";

export type WebhookEvent =
  | 'auto_save'
  | 'save'
  | 'create'
  | 'archive'
  | 'unarchive'
  | 'publish'
  | 'unpublish'
  | 'delete'

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

export type PatchEntry = Jsonify<SelectPatch>
export type PatchEntryWithUser = PatchEntry & { user?: UserProps }
export type StreamsType = keyof typeof Streams
export type StreamKeyType = keyof typeof StreamKeys
