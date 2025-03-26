import {describe, expect, it} from "vitest";
import {
  ContentfulWebhookHeaders,
  parseContentfulHeaders
} from "~/validations/webhook-headers";

describe('ContentfulTopicHeader', () => {
  it('should returned a fully typed tuple', () => {
    const result = parseContentfulHeaders(
      new Headers({'x-contentful-Topic': 'ContentManagement.Entry.save'})
    )

    expect(result.success).toBe(true)

    // @ts-expect-error to lazy to fix
    const {api, subject, event} = result.data[ContentfulWebhookHeaders.Topic];
    expect(api).toBe('ContentManagement')
    expect(subject).toBe('Entry')
    expect(event).toBe('save')
  })
})