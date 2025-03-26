import {z} from "zod";
import {WebhookEvent} from "~/shared/types";

export type ParsedHeaderTopic = {
    api: 'ContentManagement';
    subject: 'Entry';
    event: WebhookEvent;
};

export const ContentfulWebhookHeaders = {
  Name: 'x-contentful-webhook-name',
  Topic: 'x-contentful-topic',
} as const;

const TopicPartsSchema = z.tuple([
  z.literal('ContentManagement'),
  z.enum(['Entry']),
  z.enum([
    'save',
    'auto_save',
    'publish',
    'unpublish',
    'archive',
    'unarchive',
    'delete',
  ]),
]);

const ContentfulTopicHeaderValueValidation = z
  .string()
  .refine((val) => val.startsWith('ContentManagement.'), {
    message: 'Invalid topic prefix',
  })
  .transform((val, ctx): ParsedHeaderTopic => {
    const parts = val.split('.');
    const result = TopicPartsSchema.safeParse(parts);
    if (!result.success) {
      result.error.errors.forEach((error) => {
        ctx.addIssue(error);
      })
      return z.NEVER;
    }
    return {
        api: result.data[0],
        subject: result.data[1],
        event: result.data[2],
    };
  });

const createHeaderValidator = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((input) => {
    if (input instanceof Headers || input instanceof URLSearchParams) {
      return Object.fromEntries(
        Array.from(input.entries()).map(([k, v]) => [k.toLowerCase(), v])
      );
    }
    return input;
  }, schema);

export const ContentfulHeadersValidation = createHeaderValidator(
  z.object({
    [ContentfulWebhookHeaders.Topic]: ContentfulTopicHeaderValueValidation,
    // Theoretically, we could validate the name of the webhook here to ensure we only accept known webhooks
    // If we do it, we should not return the required literal in the error message
    // [ContentfulWebhookHeaders.Name]: z.literal("Event subscription (01azioAkoTPoZwxcxpUFi9)"),
  })
);

export const parseContentfulHeaders = (headers: Headers) => {
  return ContentfulHeadersValidation.safeParse(headers);
};
