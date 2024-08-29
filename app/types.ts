import {Jsonify} from "@remix-run/server-runtime/dist/jsonify";
import {SelectEntry} from "~/database/schema";
import {StreamKeys, Streams} from "~/logic/streams";

export type WebhookActions = 'auto_save' |'save' | 'create' | 'archive' | 'unarchive' | 'publish' | 'unpublish' | 'delete'
export type EntryData = Jsonify<SelectEntry>

export type StreamsType = keyof typeof Streams
export type StreamKeyType = keyof typeof StreamKeys