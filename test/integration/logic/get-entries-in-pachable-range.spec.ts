import {afterEach, beforeEach, describe, expect, it} from "vitest";
import {deleteEntry} from "~/logic/delete-entry";
import {EntryProps} from "contentful-management";
import {WebhookActions} from "~/types";
import {createEntry} from "~/logic/create-entry";
import {createEntryPayload} from "../../helpers";
import {db} from "~/database";
import {entries} from "~/database/schema";
import {getEntriesInPatchableRange} from "~/logic/get-entries-in-patchable-range";
import {getEntries} from "~/logic/get-entries";

describe.only('Create patchable entries in range', () => {
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

  it('create a raw snapshot every 5 entries', async () => {
    for (let i = 0; i < 30; i++) {
      const payload = createEntryPayload({
        key,
        version: i + 1,
        fields: {
          title: {
            'en-US': `world-${i}`
          },
        }
      })

      console.log(i, i%5)

      const entry = await  db.insert(entries).values({
        version: payload.sys.version,
        space: payload.sys.space.sys.id,
        environment: payload.sys.environment.sys.id,
        raw_entry: i%5 ? null : payload,
        entry: payload.sys.id,
        operation: 'save',
        byUser: 'test-user',
        patch: [],
        signature: 'test'
      }).returning().execute();

      toBeDeleted.push(...entry.map((e) => e.entry))

      const result = await getEntriesInPatchableRange({
        space: `${key}-space`,
        environment: `${key}-environment`,
        entry: `${key}-entry`,
        stream: 'draft',
        maxRange: 100
      })

      console.log('result', result.reverse().map((e) => e.raw_entry ? 1 : 0))
    }

    const rEntries = await getEntries({
      q: {
        space: `${key}-space`,
        environment: `${key}-environment`,
        entry: `${key}-entry`,
      }
    })
    console.table(rEntries.map((e) => e.raw_entry ? 1 : 0))

  });
});