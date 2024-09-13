import {afterEach, beforeEach, describe, expect, it} from "vitest";
import {createEntry} from "~/logic/create-entry";
import {createEntryPayload} from "../../helpers";
import {deleteEntry} from "~/logic/delete-entry";
import {EntryProps} from "contentful-management";
import {WebhookActions} from "~/types";

describe('Create Entry', () => {
  let key = ''
  let toBeDeleted: string[] = []
  beforeEach(() => {
    key = `test-${Date.now()}`
    toBeDeleted = []
  })

  afterEach(async () => {
    await deleteEntry(toBeDeleted)
  })

  const getCreateEntryParams = (payload: EntryProps, operation: WebhookActions = 'create'): Parameters<typeof createEntry>[0] => {
    return {
      space: `${key}-space`,
      environment: `${key}-environment`,
      raw: payload,
      operation,
      byUser: `${key}-user`
    }
  }

  const  createEntryTest = async (props: Parameters<typeof createEntry>[0]) => {
    const entry = await createEntry(props)
    toBeDeleted.push(...entry.map((e) => e.entry))
    return entry
  }

  it('should create a new "create" entry', async () => {
    const payload = createEntryPayload({key})
    const entry = await createEntryTest(getCreateEntryParams(payload));

    expect(entry).to.length(1);
    expect(entry[0].operation).toBe('create');
    expect(entry[0].space).toBe(`${key}-space`);
    expect(entry[0].environment).toBe(`${key}-environment`);
    expect(entry[0].byUser).toBe(`${key}-user`);
    expect(entry[0].entry).toBe(`${key}-entry`);
    expect(entry[0].raw_entry).toStrictEqual(payload);
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

    const entry0 = await createEntryTest(getCreateEntryParams(payload0));
    expect(entry0[0].patch).toStrictEqual([
      {op: 'add', path: '/fields/title', value: {'en-US': 'hello'}},
      {op: 'add', path: '/fields/obj', value: {'en-US': {key: 'value'}}},
      // {op: 'add', path: '/metadata/tags', value: []}
    ]);

    const payload1 = createEntryPayload({
      key,
      fields: {
        title: {
          'en-US': 'world'
        },
        obj: {
          'en-US': {
            key: 'new value'
          }
        }
      }
    })

    const entry1 = await createEntryTest(getCreateEntryParams(payload1, 'auto_save'));

    expect(entry1[0].patch).toStrictEqual([
      {op: 'replace', path: '/fields/title/en-US', value: 'world'},
      {op: 'replace', path: '/fields/obj/en-US', value: {key: 'new value'}},
    ]);
  })

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

    const entry0 = await createEntryTest(getCreateEntryParams(payload1, 'archive'));
    expect(entry0[0].patch).toHaveLength(0);
    expect(entry0[0].patch).toStrictEqual([]);
    expect(entry0[0].raw_entry).toStrictEqual({
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

    const entry0 = await createEntryTest(getCreateEntryParams(payload0));
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

    const entry1 = await createEntryTest(getCreateEntryParams(payload1, 'archive'));
    expect(entry1[0].patch).toHaveLength(0);
    expect(entry1[0].patch).toStrictEqual([]);
    expect(entry1[0].raw_entry).toStrictEqual(payload0);
  })

})