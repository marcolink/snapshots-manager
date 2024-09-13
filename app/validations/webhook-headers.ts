import {z} from "zod";

export const ContentfulTopicHeaderValidation = z.tuple([
  z.literal('ContentManagement'),
  z.enum(['Entry']),
  z.enum(['save', 'auto_save', 'publish', 'unpublish', 'archive', 'unarchive', 'delete']),
])

export const ContentfulTopicHeaderValueValidation = z.enum([
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

export const ContentfulWebhookHeaders = {
  Name: 'x-contentful-webhook-name',
  Topic: 'x-contentful-topic',
} as const

export const ContentfulHeadersValidation = z.object({
  // we need to fix this against to protect against spoofing
  // [ContentfulWebhookHeaders.Name]: z.literal("Event subscription (01azioAkoTPoZwxcxpUFi9)"),
  [ContentfulWebhookHeaders.Topic]: ContentfulTopicHeaderValueValidation,
})