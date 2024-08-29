import {describe, expect, it} from "vitest";
import {isContentfulLink} from "./is-contentful-link";

describe("is-contentful-link", async () => {
  it("should return true for a contentful link", async () => {
    expect(isContentfulLink({sys: {id: 'test', type: 'Link', linkType: 'Entry'}}, "Entry"),).toBe(true)
  })
  it("should return false for a contentful link with wrong entity", async () => {
    expect(isContentfulLink({sys: {id: 'test', type: 'Link', linkType: 'Entry'}}, "Asset"),).toBe(false)
  })
})