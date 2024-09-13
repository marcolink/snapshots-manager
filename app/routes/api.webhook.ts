import {ActionFunction, json} from "@remix-run/node";
import {client} from "~/logic";
import {toRecord} from "~/utils/toRecord";
import {
  ContentfulHeadersValidation,
  ContentfulTopicHeaderValidation,
  ContentfulWebhookHeaders
} from "~/validations/webhook-headers";

export class WebhookResponseError extends Error {
  constructor(message: string, public details?: any) {
    super(message);
  }
}

export const errorResponse = (error: WebhookResponseError, code = 400) => {
  return json(error, {status: code})
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
    return json({
      success: false,
      message: `Topic "${parsedHeaders[ContentfulWebhookHeaders.Topic]}" not supported (yet).`
    }, {
      headers: {
        'Content-Type': 'text/plain'
      }
    });
  }

  const [_, subject, operation] = parsedHeaderTopicData

  console.log({subject, operation})

  try {
    const entry = await request.json()
    console.log({operation, entry})
    const dnEntry = await client.createEntry({
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
    return json({
      success: true,
      patch: dnEntry?.[0]?.patch,
      signature: dnEntry?.[0]?.signature
    }, {
      headers: {
        'Content-Type': 'text/plain'
      }
    });
  } catch (e) {
    console.error(e)
    return errorResponse(new WebhookResponseError('Error processing entry'))
  }
}