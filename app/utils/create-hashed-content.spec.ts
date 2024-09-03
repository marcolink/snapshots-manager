import {describe, expect, it} from "vitest";
import {createHashedContent} from "~/utils/create-hashed-content";

describe('createHashedContent', () => {
  it('should hash the content', () => {
    expect(createHashedContent({
      fields: {hello: 'world'},
      metadata: {
        tags: []
      }
    })).toBe("454250eea6253b55ebb65ff842355626ed2eb573753f601695251a07c0cc7572")
  })

  it('should throw when more keys are present', () => {
    expect(() => createHashedContent({
      fields: {hello: 'world'},
      metadata: {
        tags: []
      },
      // @ts-expect-error just for testing purposes
      wrongKey: true
    })).toThrowError(/unrecognized_keys/)
  })
})