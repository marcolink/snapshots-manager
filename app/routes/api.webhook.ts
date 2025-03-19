import {ActionFunction} from "@remix-run/node";
import {client} from "~/client";
import {toRecord} from "~/utils/toRecord";
import {
  ContentfulHeadersValidation,
  ContentfulTopicHeaderValidation,
  ContentfulWebhookHeaders
} from "~/validations/webhook-headers";

export class WebhookResponseError extends Error {
  constructor(message: string, public details?: unknown) {
    super(message);
  }
}

export const errorResponse = (error: WebhookResponseError, code = 400) => {
  return Response.json(error, {status: code})
}

export const action: ActionFunction = async ({request}) => {
  if (request.method !== 'POST') {
    return errorResponse(
      new WebhookResponseError(`Method "${request.method}" not allowed`),
      405
    )
  }

  const {
    data: parsedHeaders,
    success: parseHeaderSuccess,
    error: parseHeaderError,
  } = ContentfulHeadersValidation.safeParse(toRecord(request.headers))

  if (!parseHeaderSuccess) {
    return errorResponse(new WebhookResponseError('Invalid headers', parseHeaderError))
  }

  const {
    success: parseHeaderTopicSuccess,
    data: parsedHeaderTopicData,
    error: parseHeaderTopicError
  } = ContentfulTopicHeaderValidation.safeParse(parsedHeaders[ContentfulWebhookHeaders.Topic].split('.'))

  if (!parseHeaderTopicSuccess) {
    console.log('unexpected topic header', parsedHeaders[ContentfulWebhookHeaders.Topic].split('.'))
    console.error(parseHeaderTopicError)
    return Response.json({
      success: false,
      message: `Topic "${parsedHeaders[ContentfulWebhookHeaders.Topic]}" not supported (yet).`
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, subject, operation] = parsedHeaderTopicData

  try {
    const entry = await request.json()
    const dnEntry = await client.patch.create({
      raw: entry,
      operation: operation,
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