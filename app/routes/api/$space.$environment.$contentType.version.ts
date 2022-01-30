import {LoaderFunction} from "remix";
import connection from "~/database/connection";
import {SnapshotModel} from "~/database/models";
import {successResponse} from "~/utils/success-response";

export const loader: LoaderFunction = async ({params}) => {
    const {space, environment, contentType} = params
    await connection()

    const first = (
        await SnapshotModel
            .find({space, environment, contentType})
            .sort('createdAt')
            .limit(1)
    )[0]

    if (!first) {
        return successResponse({message: "no version found", details: params})
    }
    return successResponse(first.state)
}
