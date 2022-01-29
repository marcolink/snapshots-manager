import {ContentTypeProps} from "contentful-management";
import {ActionFunction, LoaderFunction} from "remix";
import connection from '~/database/connection'
import {SnapshotModel} from "~/database/models";

export const loader: LoaderFunction = ({request, params}) => {
    return new Response(
        JSON.stringify(
            {
                method: request.method
            }
        ), {
            status: 200,
            headers: {}
        }
    );
}

// POST Request
export const action: ActionFunction = async ({request, params}) => {
    const webhookName = request.headers.get('X-Contentful-Webhook-Name')

    if (webhookName !== "Content Type Snapshot") {
        return new Response(
            null,
            {
                status: 401,
            }
        );
    }

    const rawTopic = request.headers.get('X-Contentful-Topic')

    if (!rawTopic) {
        return new Response(
            JSON.stringify(
                {
                    message: "topic missing"
                }
            ),
            {
                status: 400,
            }
        );
    }

    const action = rawTopic.split('.')[2]
    const data: ContentTypeProps = await request.json()
    const space = data.sys.space.sys.id
    const environment = data.sys.environment.sys.id
    const contentType = data.sys.id

    if (["create", "save", "unpublish", "delete"].includes(action)) {
        return new Response(
            null,
            {
                status: 200,
                headers: {}
            }
        );
    }

    await connection()

    const last = (
        await SnapshotModel
            .find({space, environment, contentType})
            .sort('-createdAt')
            .limit(1)
    )[0]

    const version = (last?.version ?? 0) + 1

    await SnapshotModel.create({
        space,
        contentType,
        environment,
        version,
        state: JSON.stringify(data)
    })

    return new Response(
        JSON.stringify(
            {
                version,
                action,
            }
        ), {
            status: 200,
            headers: {}
        }
    );
}
