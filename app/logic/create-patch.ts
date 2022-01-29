import {SnapshotProps} from "contentful-management";
import {ContentTypeProps} from "contentful-management/dist/typings/entities/content-type";
import {Operation} from "fast-json-patch/module/core";
import * as jsondiffpatch from "jsondiffpatch";
import {Delta} from "jsondiffpatch";
import {transformFields} from "./transform-fields";
import {MappedContentTypeProps, PatchGroup, SnapshotWithPatch} from "~/types";

function pairwise<T, R>(arr: T[], func: (a: T, b: T) => R): R[] {
    const result = []
    for (let i = 0; i < arr.length - 1; i++) {
        result.push(func(arr[i], arr[i + 1]))
    }
    return result;
}

const rootDiff = jsondiffpatch.create(
    {
        propertyFilter: function (name: string) {
            return !['sys', 'fields'].includes(name);
        }
    }
)

const fieldsDiff = jsondiffpatch.create(
    {
        /*
         * is this wanted, or do we want to track changes in order?
        objectHash: function (obj: any) {
            if (obj.hasOwnProperty('id')) {
                return obj.id;
            } else {
                return false
            }
        },
         */
    }
)

export function calculateSnapshotsPatch(left: ContentTypeProps, right: ContentTypeProps): PatchGroup {

    const transform = (props: ContentTypeProps): MappedContentTypeProps => {
        return {
            ...props,
            // @ts-ignore
            fields: transformFields(props.fields)
        }
    }

    const leftTransformed = transform(left);
    const rightTransformed = transform(right);

    // @ts-ignore
    const format: (delta: Delta | undefined) => Operation[] = jsondiffpatch.formatters.jsonpatch.format;

    const rootPatch = rootDiff.diff(leftTransformed, rightTransformed);
    const fieldsPatch = fieldsDiff.diff({fields: leftTransformed.fields}, {fields: rightTransformed.fields});

    return {
        delta: {...rootPatch, ...fieldsPatch},
        up: [
            ...format(rootPatch),
            ...format(fieldsPatch)
        ],
        down: [
            ...format(jsondiffpatch.reverse(rootPatch!)),
            ...format(jsondiffpatch.reverse(fieldsPatch!))
        ],
    }
}

export function calculatePatches(snapshots: SnapshotProps<ContentTypeProps>[]): SnapshotWithPatch[] {
    return pairwise(snapshots, (left, right) => {
        return {...right, patch: calculateSnapshotsPatch(left.snapshot, right.snapshot)}
    }).filter(s => s.patch.up.length)
}
