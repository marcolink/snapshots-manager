import {EntryProps} from "contentful-management";
import {generateJSONPatch, Patch} from "generate-json-patch";
import {TagOrConceptValidation} from "~/validations/contentful";

export type PatchableEntry = Pick<EntryProps, 'fields' | 'metadata'>;

const PATHS = ['/metadata/tags', "/metadata/concepts"];

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
        if (PATHS.includes(context.path)) {
          const {success, data} = TagOrConceptValidation.safeParse(obj);
          if (success) {
            return data.sys.id;
          } else {
            throw new Error('Invalid tag or concept');
          }
        }
        return context.index.toString();
      },
    })
  ];
}