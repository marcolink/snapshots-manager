import {ContentFields} from "contentful-management";
import {ContentTypeProps} from "contentful-management/dist/typings/entities/content-type";
import {SnapshotProps} from "contentful-management/dist/typings/entities/snapshot";
import {Operation} from "fast-json-patch/module/core";
import {Delta} from "jsondiffpatch";

export type Patch = Operation[]

export type Snapshot = {
    version: number
    space: string
    environment: string
    contentType: string
    state: string
}

export type PatchGroup = {
    delta: Delta
    up: Patch,
    down: Patch
}

export type FieldsMap = Record<string, ContentFields>;

export type MappedContentTypeProps = ContentTypeProps & {fields: Record<string, ContentFields>}

export type SnapshotWithPatch = SnapshotProps<ContentTypeProps> & {
    patch: PatchGroup
}
