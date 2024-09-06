import {describe, expect, it} from "vitest";
import {Operation} from "generate-json-patch";
import {createFieldChange, createMetadataChange} from "~/utils/patch-utils";

const locales = ['en-US', 'de-DE']

const patches: Record<string, Operation> = {
  newField: {
    op: "add",
    path: "/fields/testField",
    value: {
      "en-US": "testValue"
    }
  }
}

describe('createFieldChange', () => {
  it('detects a string value', () => {
    expect(createFieldChange({
      op: "add",
      path: "/fields/testField",
      value: {
        "en-US": "testValue"
      }
    }, locales)).toStrictEqual([{
      operation: 'add',
      field: 'testField',
      locale: 'en-US',
      value: 'testValue'
    }])
  })
  it('detects a multi locales changes', () => {
    expect(createFieldChange({
      op: "add",
      path: "/fields/testField",
      value: {
        "en-US": "testValueEN",
        "de-DE": "testValueDE"
      }
    }, locales)).toStrictEqual([{
      operation: 'add',
      field: 'testField',
      locale: 'en-US',
      value: 'testValueEN'
    }, {
      operation: 'add',
      field: 'testField',
      locale: 'de-DE',
      value: 'testValueDE'
    }])
  })
  it('detect value locale', () => {
    expect(createFieldChange({
      op: "add",
      path: "/fields/testField",
      value: {
        "en-US": "testValue"
      }
    }, locales)).toStrictEqual([{
      operation: 'add',
      field: 'testField',
      locale: 'en-US',
      value: 'testValue'
    }])
  })
  it('detects an array value', () => {
    expect(createFieldChange({
      op: "add",
      path: "/fields/testField",
      value: {
        "en-US": ["one", "two"]
      }
    }, locales)).toStrictEqual([{
      operation: 'add',
      field: 'testField',
      locale: 'en-US',
      value: ["one", "two"]
    }])
  })
  it('detects the field name', () => {
    expect(createFieldChange(patches.newField, locales)).toStrictEqual([{
      operation: 'add',
      field: 'testField',
      locale: 'en-US',
      value: 'testValue'
    }])
  })
  it('detects locale from path', () => {
    expect(createFieldChange({
      op: "add",
      path: "/fields/testField/en-US",
      value: 'hello world'
    }, locales)).toStrictEqual([{
      operation: 'add',
      field: 'testField',
      locale: 'en-US',
      value: 'hello world'
    }])
  })
})

describe('createMetadataChange', () => {
  it('detects empty concepts', () => {
    expect(createMetadataChange({
      "op": "add",
      "path": "/metadata/concepts",
      "value": []
    })).toStrictEqual([{
      operation: 'add',
      field: 'concepts',
      value: "initialized"
    }])
  })
  it('detects add a tag', () => {
    expect(createMetadataChange({
      "op": "add",
      "path": "/metadata/tags/0",
      "value": {
        "sys": {
          "id": "someTag",
          "type": "Link",
          "linkType": "Tag"
        }
      }
    })).toStrictEqual([{
      operation: 'add',
      field: 'tags',
      value: {
        "sys": {
          "id": "someTag",
          "type": "Link",
          "linkType": "Tag"
        }
      }
    }])
  })
})