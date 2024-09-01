import {describe, expect, it} from "vitest";
import {Operation} from "generate-json-patch";
import {createFieldChange} from "~/components/PatchComponent";

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

describe('PatchComponent', () => {
  it('string', () => {
    expect(createFieldChange({
      op: "add",
      path: "/fields/testField",
      value: {
        "en-US": "testValue"
      }
    }, locales)).toStrictEqual([{
      changeTpe: 'add',
      field: 'testField',
      locale: 'en-US',
      value: 'testValue'
    }])
  })
  it('multiple locales', () => {
    expect(createFieldChange({
      op: "add",
      path: "/fields/testField",
      value: {
        "en-US": "testValueEN",
        "de-DE": "testValueDE"
      }
    }, locales)).toStrictEqual([{
      changeTpe: 'add',
      field: 'testField',
      locale: 'en-US',
      value: 'testValueEN'
    }, {
      changeTpe: 'add',
      field: 'testField',
      locale: 'de-DE',
      value: 'testValueDE'
    }])
  })
  it('detect locale', () => {
    expect(createFieldChange({
      op: "add",
      path: "/fields/testField",
      value: {
        "en-US": "testValue"
      }
    }, locales)).toStrictEqual([{
      changeTpe: 'add',
      field: 'testField',
      locale: 'en-US',
      value: 'testValue'
    }])
  })
  it('array of string', () => {
    expect(createFieldChange({
      op: "add",
      path: "/fields/testField",
      value: {
        "en-US": ["one", "two"]
      }
    }, locales)).toStrictEqual([{
      changeTpe: 'add',
      field: 'testField',
      locale: 'en-US',
      value: ["one", "two"]
    }])
  })
  it('should detect the field', () => {
    expect(createFieldChange(patches.newField, locales)).toStrictEqual([{
      changeTpe: 'add',
      field: 'testField',
      locale: 'en-US',
      value: 'testValue'
    }])
  })
  it('should detect locale from path', () => {
    expect(createFieldChange({
      op: "add",
      path: "/fields/testField/en-US",
      value: 'hello world'
    }, locales)).toStrictEqual([{
      changeTpe: 'add',
      field: 'testField',
      locale: 'en-US',
      value: 'hello world'
    }])
  })
})