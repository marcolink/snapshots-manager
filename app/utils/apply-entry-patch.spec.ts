import {describe, expect, it} from "vitest"
import {createEntryPayload} from "../../test/helpers";
import {applyEntryPatch} from "~/utils/apply-entry-patch";

describe('applyEntryPatch', () => {
  it('should apply a patch to an entry', () => {
    const entry = createEntryPayload({key: 'test', fields: {title: {'en-US': 'hello'}}})
    const patch = [
      {op: 'replace', path: '/fields/title/en-US', value: 'world'}
    ]

    // @ts-ignore
    const patchedEntry = applyEntryPatch({entry, patches: [patch]})

    expect(entry.fields.title['en-US']).toBe('hello')
    expect(patchedEntry.fields.title['en-US']).toBe('world')
  })
})