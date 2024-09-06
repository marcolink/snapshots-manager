import { describe, expect, it } from "vitest";
import {ContentfulTopicHeaderValidation} from "~/validations/webhook-headers";

describe('ContentfulTopicHeader', () => {
  it('should validate a valid tuple', () => {
    expect(ContentfulTopicHeaderValidation.safeParse(['ContentManagement', 'Entry', 'save']).success).toBe(true)
  })
  it('should returned a fully typed tuple', () => {
    const [api, subject, operation] = ContentfulTopicHeaderValidation.parse(['ContentManagement', 'Entry', 'save'])
    expect(api).toBe('ContentManagement')
    expect(subject).toBe('Entry')
    expect(operation).toBe('save')
  })
})