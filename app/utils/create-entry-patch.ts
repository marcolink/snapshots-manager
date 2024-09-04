import {EntryProps} from "contentful-management";
import {generateJSONPatch, Patch} from "generate-json-patch";

export type PatchableEntry = Pick<EntryProps, 'fields' | 'metadata'>;

export function createEntryPatch(
  sourceContent: PatchableEntry,
  targetContent: PatchableEntry
): Patch {
  return [
    ...generateJSONPatch({
      fields: sourceContent.fields
    }, {
      fields: targetContent.fields
    }, {
      maxDepth: 4
    }),
    ...generateJSONPatch({
      metadata: sourceContent.metadata
    }, {
      metadata: targetContent.metadata
    }, {
      maxDepth: 3,
      array: {
        ignoreMove: true
      }
    })
  ];
}