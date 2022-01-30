import {ContentTypeProps} from "contentful-management";
import {ActionFunction} from "remix";
import {WebhookHeaders} from "~/constants";
import {updateVersionHandler} from "~/logic/handler-update-version";
import {errorResponse, WebhookResponseError} from "~/utils/error-response";
import {extractRequestData} from "~/utils/extract-request-data";
import {successResponse} from "~/utils/success-response";

export const action: ActionFunction = async ({request, params}) => {
    if (!request.headers.has(WebhookHeaders.Name)) {
        return errorResponse(new WebhookResponseError("Request unidentifiable"), 401);
    }

    const webhookName = request.headers.get(WebhookHeaders.Name)
    const rawTopic = request.headers.get(WebhookHeaders.Topic)

    if (webhookName !== WebhookHeaders.Type.ContentType) {
        return errorResponse(new WebhookResponseError('Wrong webhook'))
    }

    if (!rawTopic) {
        return errorResponse(new WebhookResponseError('Topic missing'))
    }

    const action = rawTopic.split('.')[2]
    const {space, environment, contentType, payload} = await extractRequestData<ContentTypeProps>(request)

    if (["create", "save", "unpublish", "delete"].includes(action)) return successResponse();
    return updateVersionHandler({space, environment, contentType, payload})
}
