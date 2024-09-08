import {afterEach, beforeEach, describe, expect, it} from "vitest";
import {deleteEntry} from "~/logic/delete-entry";
import {EntryProps} from "contentful-management";
import {WebhookActions} from "~/types";
import {createEntry} from "~/logic/create-entry";
import {createEntryPayload} from "../../helpers";
import {getReferenceEntry} from "~/logic/get-reference-entry";

describe('Get Reference Entry', () => {
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

  it('return first entry as reference entry', async () => {
    const payload = createEntryPayload({key})
    const entry = (await createEntryTest(getCreateEntryParams(payload)))[0];

    const refEntry = await getReferenceEntry({
      space: entry.space,
      environment: entry.environment,
      entry: entry.entry,
      stream: 'publish'
    })

    // @ts-ignore
    expect(refEntry[0].raw_entry?.sys.id).toBe(entry.entry)
  })
})