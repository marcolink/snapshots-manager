import {describe, expect, it} from "vitest";
import {createHashedContent} from "~/utils/create-hashed-content";

describe('createHashedContent', () => {
  it('should hash the content', () => {
    expect(createHashedContent({
      fields: {hello: 'world'},
      metadata: {
        tags: []
      }
    })).toBe("0cfc1efe544d8548bd722fb7d6e25d3c7e1f3d770610dc30f479199bbf38a52e")
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