import { describe, expect, it } from "vitest";
import { createHash } from "./create-hash";

describe('createHash', () => {
  it('should hash the data with single quotes', () => {
    expect(createHash({hello: 'world'})).toBe("872c323fe6eded11a05c1aa006da064a37535d85bb06e517966178d426fea386")
  })
  it('should hash the data with double quotes', () => {
    expect(createHash({hello: "world"})).toBe("872c323fe6eded11a05c1aa006da064a37535d85bb06e517966178d426fea386")
  })
  it('should hash the data with bracket key', () => {
    expect(createHash({['hello']: "world"})).toBe("872c323fe6eded11a05c1aa006da064a37535d85bb06e517966178d426fea386")
  })

  it('should create identical hashes for objects with different key order', () => {
    const hash1 = createHash({hello: 'world', foo: 'bar'})
    const hash2 = createHash({foo: 'bar', hello: 'world'})
    expect(hash1).toBe(hash2)
  })
})