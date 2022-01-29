import {LoaderFunction} from "remix";
import connection from "~/database/connection";
import {SnapshotModel} from "~/database/models";

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
        return new Response(
            JSON.stringify({
                    message: "no version found",
                    details: params
                }
            ), {
                status: 200,
                headers: {}
            }
        );
    }

    return new Response(
        first.state, {
            status: 200,
            headers: {}
        }
    );
}
