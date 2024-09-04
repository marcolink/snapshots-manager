import {EntryProps} from "contentful-management";
import {generateJSONPatch, Patch} from "generate-json-patch";
import {TagOrConceptValidation} from "~/validations/contentful";

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
      objectHash: (obj, context) => {
        if (context.path.length === 3) {
          const {success, data} = TagOrConceptValidation.safeParse(obj);
          if (success) {
            return data?.sys.id;
          }
        }
        return JSON.stringify(obj);
      },
      array: {
        ignoreMove: true
      }
    })
  ];
}