import {ActionFunction} from "@remix-run/node";
import {client} from "~/backend/client";
import {ContentfulWebhookHeaders, parseContentfulHeaders} from "~/validations/webhook-headers";

export class WebhookResponseError extends Error {
  constructor(message: string, public details?: unknown) {
    super(message);
  }
}

export const errorResponse = (error: WebhookResponseError, code = 400) => {
  return Response.json({success: false, ...error}, {status: code})
}

export const action: ActionFunction = async ({request}) => {
  if (request.method !== 'POST') {
    return errorResponse(new WebhookResponseError(`Method "${request.method}" not allowed`), 405)
  }

  const result = parseContentfulHeaders(request.headers);

  if (!result.success) {
    console.error(result.error)
    return errorResponse(new WebhookResponseError('Invalid headers', 400));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {event} = result.data[ContentfulWebhookHeaders.Topic];

  try {
    const entry = await request.json()
    const dnEntry = await client.patch.create({
      raw: entry,
      operation: event,
      space: entry.sys.space.sys.id,
      environment: entry.sys.environment.sys.id,
      // for some reason, the user is not present for "unpublish"
      byUser: entry.sys.updatedBy?.sys.id
        || entry.sys.createBy?.sys.id
        || entry.sys.archivedBy?.sys.id
        || 'unknown'
    })
    return Response.json({
      success: true,
      patch: dnEntry?.[0]?.patch || [],
    });
  } catch (e) {
    console.error(e)
    return errorResponse(new WebhookResponseError('Error processing entry'))
  }
}