import {ActionFunction} from "@remix-run/node";

export const WebhookHeaders = {
  Name: 'X-Contentful-Webhook-Name',
  Type: {
    ContentType: "Content-Type Snapshot",
    Entry: "Entry Snapshot"
  },
  Topic: 'X-Contentful-Topic'
}

export class WebhookResponseError extends Error {
  constructor(message: string, public details?: any) {
    super(message);
  }
}

export const errorResponse = (error: WebhookResponseError, code = 400) => {
  return new Response(JSON.stringify(error), {status: code})
}

export const action: ActionFunction = async ({request}) => {
  if(request.method !== 'POST') {
    return errorResponse(new WebhookResponseError('Method not allowed'), 405)
  }

  if (!request.headers.has(WebhookHeaders.Name)) {
    return errorResponse(new WebhookResponseError("Request unidentifiable"), 401);
  }

  const webhookName = request.headers.get(WebhookHeaders.Name)
  const rawTopic = request.headers.get(WebhookHeaders.Topic)

  if (webhookName !== WebhookHeaders.Type.ContentType) {
    return errorResponse(new WebhookResponseError('Wrong webhook'))
  }

  return new Response('Hello, world!', {
    headers: {
      'Content-Type': 'text/plain'
    }
  });
}