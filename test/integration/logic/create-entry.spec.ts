import {afterEach, beforeEach, describe, expect, it} from "vitest";
import {createEntry} from "~/logic/create-entry";
import {createEntryPayload} from "../../helpers";
import {deleteEntry} from "~/logic/delete-entry";
import {EntryProps} from "contentful-management";
import {WebhookActions} from "~/types";
import {getEntries} from "~/logic/get-entries";
import {getEntriesInPatchableRange} from "~/logic/get-entries-in-patchable-range";

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

  const createEntryTest = async (props: Parameters<typeof createEntry>[0]) => {
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

  it('should create a new entry for the first entry with raw payload ', async () => {
    for (let i = 0; i < 10; i++) {
      const payload = createEntryPayload({
        key,
        fields: {
          title: {
            'en-US': `world-${i}`
          },
        }
      })
      const e = await createEntryTest(getCreateEntryParams(payload));

      if (i === 0) {
        expect(e[0].raw_entry).toStrictEqual(payload);
      } else {
        expect(e[0].raw_entry).toBeNull();
      }
    }

    const entries = await getEntries({
      q: {
        space: `${key}-space`,
        environment: `${key}-environment`,
        entry: `${key}-entry`,
      }
    })

    // only the last entry in the list of entries ordered by created_at should have raw_entry
    for (let i = 0; i < entries.length - 1; i++) {
      expect(entries[i].raw_entry).toBeNull()
    }
  })

  it.only('should persist a raw entry every 10 entries', async () => {

    // const key = `raw-iteration-test-${Date.now()}`

    for (let i = 0; i < 23; i++) {
      const payload = createEntryPayload({
        key,
        version: i + 1,
        fields: {
          title: {
            'en-US': `world-${i}`
          },
        }
      })
      await createEntryTest(getCreateEntryParams(payload, 'auto_save'));
    }

    const lastRangeEntries = await getEntriesInPatchableRange({
      space: `${key}-space`,
      environment: `${key}-environment`,
      entry: `${key}-entry`,
      stream: 'draft',
    })

    // expect(lastRangeEntries).toHaveLength(10)
    // console.log(lastRangeEntries.map((e) => e.raw_entry ? 1 : 0))

    const entries = await getEntries({
      q: {
        space: `${key}-space`,
        environment: `${key}-environment`,
        entry: `${key}-entry`,
      }
    })
    console.log('final entries')
    console.table(entries.map((e) => e.raw_entry ? 1 : 0))
    // console.table(entries.map((e) => e.version))

    expect(entries).toHaveLength(23)
    expect(entries.filter((e) => e.raw_entry !== null)).toHaveLength(2)
  })
})
