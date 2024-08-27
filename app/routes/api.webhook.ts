import {ActionFunction, json} from "@remix-run/node";
import {z} from "zod";
import {createEntry} from "~/logic";
import {Search} from "react-router";
import {toRecord} from "~/utils/toRecord";

export const ContentfulWebhookHeaders = {
  Name: 'x-contentful-webhook-name',
  Topic: 'x-contentful-topic',
} as const

export class WebhookResponseError extends Error {
  constructor(message: string, public details?: any) {
    super(message);
  }
}

const ContentfulTopicHeader = z.enum([
  'ContentManagement.Entry.create',
  'ContentManagement.Entry.auto_save',
  'ContentManagement.Entry.publish',
  'ContentManagement.Entry.unpublish',
  'ContentManagement.Entry.delete'
])

const ContentfulHeaders = z.object({
  [ContentfulWebhookHeaders.Name]: z.literal("Snapshot Manager"),
  [ContentfulWebhookHeaders.Topic]: ContentfulTopicHeader,
})

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

  const {error, data: headers, success} = ContentfulHeaders.safeParse(toRecord(request.headers))

  if (!success) {
    return errorResponse(new WebhookResponseError('Invalid headers', error))
  }

  if (headers[ContentfulWebhookHeaders.Topic].includes('ContentType')) {
    return errorResponse(new WebhookResponseError('Content Type webhooks are not supported yet'))
  }

  const [_, subject, operation] = headers[ContentfulWebhookHeaders.Topic].split('.')

  console.log({subject, operation})

  if (subject === 'Entry') {
    const entry = await request.json()
    await createEntry({
      raw: entry,
      operation: operation,
      space: entry.sys.space.sys.id,
      environment: entry.sys.environment.sys.id,
      byUser: entry.sys.updatedBy.sys.id || entry.sys.createBy.sys.id
    })
  }

  return new Response('success', {
    headers: {
      'Content-Type': 'text/plain'
    }
  });
}