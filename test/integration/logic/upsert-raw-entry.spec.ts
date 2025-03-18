import {beforeEach, describe, expect, it} from "vitest";
import {upsertRawEntry} from "~/logic/upsert-raw-entry";
import {getRawEntry} from "~/logic/get-raw-entry";
import {deepClone} from "@vitest/utils";

describe('Upsert raw Entry', async () => {

  let key = ''
  beforeEach(() => {
    key = `test-${Date.now()}`
  })

  it('should create and then upsert raw entry', async () => {
    const payload = {
      space: `${key}-test-space`,
      environment: 'test-environment',
      entry: 'test-id',
      version: 1,
      raw: {
        sys: {
          id: 'test-id',
          revision: 1
        }
      },
      operation: 'save',
      byUser: 'test-user'
    }

    // @ts-ignore
    await upsertRawEntry(payload);

    const updatedEntryPayload = deepClone(payload)
    updatedEntryPayload.raw.sys.revision = 2

    // @ts-ignore
    await upsertRawEntry({...updatedEntryPayload, operation: 'auto_save'});

    const response = await getRawEntry({
      space: payload.space,
      environment: payload.environment,
      entry: payload.entry,
      operation: 'save'
    });

    expect(response.raw).toStrictEqual(updatedEntryPayload.raw);
  });
})