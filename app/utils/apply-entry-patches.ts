import {EntryProps} from "contentful-management";
import { applyPatch } from "fast-json-patch";
import {Patch} from "generate-json-patch";

type Params = {
  entry: EntryProps,
  patches: Patch[]
}

export function applyEntryPatches({entry, patches}: Params): EntryProps {
  const patchedEntry = structuredClone(entry)
  for (const patch of patches) {
    applyPatch(patchedEntry, patch)
  }
  return patchedEntry
}