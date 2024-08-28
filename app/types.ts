import {Jsonify} from "@remix-run/server-runtime/dist/jsonify";
import {SelectEntry} from "~/database/schema";

export type WebhookActions = 'auto_save' |'save' | 'create' | 'archive' | 'unarchive' | 'publish' | 'unpublish' | 'delete'
export type EntryData = Jsonify<SelectEntry>
