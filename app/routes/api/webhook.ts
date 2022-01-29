import {ContentTypeProps} from "contentful-management";
import {ActionFunction, LoaderFunction} from "remix";

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

    const contentType: ContentTypeProps = await request.json()
    const space = contentType.sys.space.sys.id
    const environment = contentType.sys.environment.sys.id
    const contentTypeId = contentType.sys.id

    console.log(contentType)


    return new Response(
        JSON.stringify(
            {
                method: request.method,
                action,
                space,
                environment,
                contentTypeId
            }
        ), {
            status: 200,
            headers: {}
        }
    );
}
