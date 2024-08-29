import {afterEach, beforeEach, describe, expect, it} from "vitest";
import {createEntry} from "~/logic/create-entry";
import {createEntryPayload} from "../../helpers";
import {deleteEntry} from "~/logic/delete-entry";

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

  it('should create a new "create" entry', async () => {
    const payload = createEntryPayload({key})

    const entry = await createEntry({
      space: `${key}-space`,
      environment: `${key}-environment`,
      raw: payload,
      operation: 'create',
      byUser: `${key}-user`
    });

    toBeDeleted.push(...entry.map((e) => e.entry))

    expect(entry).to.length(1);
    expect(entry[0].operation).toBe('create');
    expect(entry[0].space).toBe(`${key}-space`);
    expect(entry[0].environment).toBe(`${key}-environment`);
    expect(entry[0].byUser).toBe(`${key}-user`);
    expect(entry[0].entry).toBe(`${key}-entry`);
    expect(entry[0].raw_entry).toStrictEqual(payload);
  });
})