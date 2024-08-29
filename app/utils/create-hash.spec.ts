import { describe, expect, it } from "vitest";
import { createHash } from "./create-hash";

describe('createHash', () => {
  it.only('should hash the data with single quotes', () => {
    expect(createHash({hello: 'world'})).toBe("93a23971a914e5eacbf0a8d25154cda309c3c1c72fbb9914d47c60f3cb681588")
  })
  it.only('should hash the data with double quotes', () => {
    expect(createHash({hello: "world"})).toBe("93a23971a914e5eacbf0a8d25154cda309c3c1c72fbb9914d47c60f3cb681588")
  })
  it.only('should hash the data with bracket key', () => {
    expect(createHash({['hello']: "world"})).toBe("93a23971a914e5eacbf0a8d25154cda309c3c1c72fbb9914d47c60f3cb681588")
  })
})