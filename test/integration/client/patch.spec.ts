import {beforeEach, describe, expect, it} from "vitest";
import {createPatch} from "~/client/patch/create-patch";
import {createEntryPayload} from "../../helpers";
import {EntryProps} from "contentful-management";
import {WebhookActions} from "~/types";
import {deepClone} from "@vitest/utils";
import {getRawEntry} from "~/client/entry/get-raw-entry";

describe('Create Entry', async () => {
  let key = ''

  beforeEach(() => {
    key = `test-${Date.now()}`
  })

  const getCreateEntryParams = (payload: EntryProps, operation: WebhookActions = 'create'): Parameters<typeof createPatch>[0] => {
    return {
      space: `${key}-space`,
      environment: `${key}-environment`,
      raw: payload,
      operation,
      byUser: `${key}-user`
    }
  }

  const createEntryTest = async (props: Parameters<typeof createPatch>[0]) => {
    const entry = await createPatch(props)
    const rawEntry = await getRawEntry({...props, entry: props.raw.sys.id, operation: props.operation})
    return {entry, rawEntry}
  }

  it('should create a new "create" entry', async () => {
    const payload = createEntryPayload({key})
    const {entry, rawEntry} = await createEntryTest(getCreateEntryParams(payload));

    expect(entry).to.length(1);
    expect(entry[0].operation).toBe('create');
    expect(entry[0].space).toBe(`${key}-space`);
    expect(entry[0].environment).toBe(`${key}-environment`);
    expect(entry[0].byUser).toBe(`${key}-user`);
    expect(entry[0].entry).toBe(`${key}-entry`);
    expect(rawEntry?.raw).toStrictEqual(payload);
  });

  it('should create a new "create" entry and patch', async () => {
    const payload0 = createEntryPayload({
      key,
      fields: {
        title: {
          'en-US': 'hello'
        },
        obj: {
          'en-US': {
            key: 'value'
          }
        }
      }
    })

    const {entry: entry0} = await createEntryTest(getCreateEntryParams(payload0, 'save'));
    expect(entry0[0].patch).toStrictEqual([
      {op: 'add', path: '/fields/title', value: {'en-US': 'hello'}},
      {op: 'add', path: '/fields/obj', value: {'en-US': {key: 'value'}}},
      // {op: 'add', path: '/metadata/tags', value: []}
    ]);

    const lastRaw0 = await getRawEntry({
      space: `${key}-space`,
      environment: `${key}-environment`,
      entry: `${key}-entry`,
      operation: 'save'
    })

    expect(lastRaw0.raw).toStrictEqual(payload0);

    const payload1 = deepClone(payload0)
    payload1.fields.title['en-US'] = 'world'
    payload1.fields.obj['en-US'] = {key: 'new value'}

    const {entry: entry1} = await createEntryTest(getCreateEntryParams(payload1, 'auto_save'));

    const lastRaw1 = await getRawEntry({
      space: `${key}-space`,
      environment: `${key}-environment`,
      entry: `${key}-entry`,
      operation: 'save'
    })

    expect(lastRaw1.raw).toStrictEqual(payload1);
    expect(entry1[0].patch).toStrictEqual([
      {op: 'replace', path: '/fields/title/en-US', value: 'world'},
      {op: 'replace', path: '/fields/obj/en-US', value: {key: 'new value'}},
    ]);
  })

  //currently not sure if this is the correct behavior
  it('for the first entry appearance, it should create a new "archive" entry with default raw', async () => {
    const payload1 = createEntryPayload({
      key,
      fields: {
        title: {
          'en-US': 'hello'
        },
        obj: {
          'en-US': {
            key: 'value'
          }
        }
      }
    })

    const {entry: entry0, rawEntry: rawEntry0} = await createEntryTest(getCreateEntryParams(payload1, 'archive'));
    expect(entry0[0].patch).toHaveLength(0);
    expect(entry0[0].patch).toStrictEqual([]);
    expect(rawEntry0.raw).toStrictEqual({
      fields: {},
      metadata: {tags: []},
      sys: {
        ...payload1.sys,
      }
    });
  })

  it('it should create a new "archive" entry with default raw', async () => {
    const payload0 = createEntryPayload({
      key,
      fields: {
        title: {
          'en-US': 'hello'
        },
        obj: {
          'en-US': {
            key: 'value'
          }
        }
      }
    })

    const {entry: entry0} = await createEntryTest(getCreateEntryParams(payload0));
    expect(entry0[0].patch).toStrictEqual([
      {op: 'add', path: '/fields/title', value: {'en-US': 'hello'}},
      {op: 'add', path: '/fields/obj', value: {'en-US': {key: 'value'}}},
      // {op: 'add', path: '/metadata/tags', value: []}
    ]);
    const payload1 = createEntryPayload({
      key,
      fields: {
        title: {
          'en-US': 'hello'
        },
        obj: {
          'en-US': {
            key: 'value'
          }
        }
      }
    })

    const {entry: entry1, rawEntry: rawEntry1} = await createEntryTest(getCreateEntryParams(payload1, 'archive'));
    expect(entry1[0].patch).toHaveLength(0);
    expect(entry1[0].patch).toStrictEqual([]);
    expect(rawEntry1.raw).toStrictEqual(payload0);
  })

})