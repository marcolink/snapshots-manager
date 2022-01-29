import * as mongoose from "mongoose";
import {model, Schema} from "mongoose";
import {Patch, Snapshot} from "~/types";

if (mongoose.models.Snapshot) {
    delete mongoose.models.Snapshot
}

if (mongoose.models.Patch) {
    delete mongoose.models.Patch
}

const PatchSchema = new Schema<Patch>(
    {
        operations: [
            {
                path: {
                    type: String,
                    required: true
                },
                op: {
                    type: String,
                    required: true
                },
                from: {
                    type: String,
                    required: false
                }
            }
        ]
    }
);

const SnapshotSchema = new Schema<Snapshot>(
    {
        space: {
            type: String,
            required: true,
        },
        version: {
            type: Number,
            required: true,
        },
        environment: {
            type: String,
            required: true,
        },
        contentType: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true,
    }
);

export const PatchModel = model<Patch>(
    "Patch",
    PatchSchema
);

export const SnapshotModel = model<Snapshot>(
    "Snapshot",
    SnapshotSchema
);
