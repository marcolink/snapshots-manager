import {Jsonify} from "@remix-run/server-runtime/dist/jsonify";
import { UserProps } from "contentful-management";
import {SelectPatch} from "~/store/schema";
import {StreamKeys, Streams} from "~/client/streams";

export type WebhookEvent = 'auto_save' |'save' | 'create' | 'archive' | 'unarchive' | 'publish' | 'unpublish' | 'delete'
export type PatchEntry = Jsonify<SelectPatch>
export type PatchEntryWithUser = PatchEntry & { user?: UserProps }

export type StreamsType = keyof typeof Streams
export type StreamKeyType = keyof typeof StreamKeys