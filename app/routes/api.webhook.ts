import {ActionFunction} from "@remix-run/node";
import {z} from "zod";

export const ContentfulWebhookHeaders = {
  Name: 'X-Contentful-Webhook-Name',
  Topic: 'X-Contentful-Topic',
} as const

export class WebhookResponseError extends Error {
  constructor(message: string, public details?: any) {
    super(message);
  }
}

const ContentfulTopicHeader = z.union([
  z.literal('ContentfulManagement.Entry.create'),
  z.literal('ContentfulManagement.Entry.publish'),
  z.literal('ContentfulManagement.Entry.unpublish'),
  z.literal('ContentfulManagement.Entry.delete')
])

const ContentfulHeaders = z.object({
  [ContentfulWebhookHeaders.Name]: z.literal('Snapshot Manager'),
  [ContentfulWebhookHeaders.Topic]: ContentfulTopicHeader,
})

const toHeadersRecord = (headers: Headers) => {
  return Object.fromEntries(Array.from(headers.entries()));
}

export const errorResponse = (error: WebhookResponseError, code = 400) => {
  return new Response(JSON.stringify(error), {status: code})
}

export const action: ActionFunction = async ({request}) => {
  if (request.method !== 'POST') {
    return errorResponse(new WebhookResponseError('Method not allowed'), 405)
  }

  const {error, data: headers, success} = ContentfulHeaders.safeParse(toHeadersRecord(request.headers))

  if (!success) {
    return errorResponse(new WebhookResponseError('Invalid headers', error?.message))
  }

  if (headers[ContentfulWebhookHeaders.Topic].includes('ContentType')) {
    return errorResponse(new WebhookResponseError('Content Type webhooks are not supported yet'))
  }

  const [_, subject, operation] = headers[ContentfulWebhookHeaders.Topic].split('.')

  console.log({subject, operation})

  return new Response('Hello, world!', {
    headers: {
      'Content-Type': 'text/plain'
    }
  });
}