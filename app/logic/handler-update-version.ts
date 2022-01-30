import {ContentTypeProps} from "contentful-management";
import connection from "~/database/connection";
import {SnapshotModel} from "~/database/models";
import {successResponse} from "~/utils/success-response";

type Props = {
    payload: ContentTypeProps,
    space: string,
    environment: string,
    contentType: string
}

type HandlerFunction<PropType> = (props: PropType) => Promise<Response>

export const updateVersionHandler: HandlerFunction<Props> = async (
    {
        payload,
        space,
        environment,
        contentType
    }
) => {

    await connection()

    const last = (
        await SnapshotModel
            .find({space, environment, contentType})
            .sort('-createdAt')
            .limit(1)
    )[0]

    const state = JSON.stringify(payload);

    if (last.state === state) {
        return successResponse({message: "unchanged", version: last.version})
    }

    const version = (last?.version ?? 0) + 1

    await SnapshotModel.create({
        space,
        contentType,
        environment,
        version,
        state
    })

    return successResponse({message: "updated", version})

}
