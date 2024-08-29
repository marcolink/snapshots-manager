import {ActionFunction, json} from "@remix-run/node";
import {z} from "zod";
import {client} from "~/logic";
import {toRecord} from "~/utils/toRecord";
import {WebhookActions} from "~/types";

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
  'ContentManagement.ContentType.create',
  'ContentManagement.ContentType.save',
  'ContentManagement.ContentType.publish',
  'ContentManagement.ContentType.unpublish',
  'ContentManagement.ContentType.delete',
  'ContentManagement.Entry.create',
  'ContentManagement.Entry.save',
  'ContentManagement.Entry.auto_save',
  'ContentManagement.Entry.archive',
  'ContentManagement.Entry.unarchive',
  'ContentManagement.Entry.publish',
  'ContentManagement.Entry.unpublish',
  'ContentManagement.Entry.delete',
  'ContentManagement.Asset.create',
  'ContentManagement.Asset.save',
  'ContentManagement.Asset.auto_save',
  'ContentManagement.Asset.archive',
  'ContentManagement.Asset.unarchive',
  'ContentManagement.Asset.publish',
  'ContentManagement.Asset.unpublish',
  'ContentManagement.Asset.delete',
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

  // Unpublish payload, (archived) might be the same
  // {
  //   "sys": {
  //   "type": "DeletedEntry",
  //     "id": "4y6EPw1MabFaMhSg14dSXJ",
  //     "space": {
  //     "sys": {
  //       "type": "Link",
  //         "linkType": "Space",
  //         "id": "a6ucnp32h2xm"
  //     }
  //   },
  //   "environment": {
  //     "sys": {
  //       "id": "master",
  //         "type": "Link",
  //         "linkType": "Environment"
  //     }
  //   },
  //   "contentType": {
  //     "sys": {
  //       "type": "Link",
  //         "linkType": "ContentType",
  //         "id": "timeMachineExample"
  //     }
  //   },
  //   "revision": 3,
  //     "createdAt": "2024-08-29T18:03:36.855Z",
  //     "updatedAt": "2024-08-29T18:03:36.855Z",
  //     "deletedAt": "2024-08-29T18:03:36.855Z"
  // }
  // }

  // validate the subject and operation
  if (subject === 'Entry') {
    const entry = await request.json()
    const dnEntry = await client.createEntry({
      raw: entry,
      operation: operation as WebhookActions,
      space: entry.sys.space.sys.id,
      environment: entry.sys.environment.sys.id,
      byUser: entry.sys.updatedBy.sys.id || entry.sys.createBy.sys.id
    })
    return json({success: true, patch: dnEntry?.[0]?.patch}, {
      headers: {
        'Content-Type': 'text/plain'
      }
    });
  } else {
    return json({
      success: false,
      message: `Subject "${subject}" not supported (yet).`
    }, {
      headers: {
        'Content-Type': 'text/plain'
      }
    });
  }
}