import {describe, expect, it} from "vitest";
import {EntryProps} from "contentful-management";
import {createEntryPatch, PatchableEntry} from "~/utils/create-entry-patch";

const emptyMetadata: EntryProps['metadata'] = {
  tags: []
}

describe("create-entry-patch", () => {
  it("create a replace operation for a field with a changed string content", () => {
    const sourceContent: PatchableEntry = {
      ...emptyMetadata,
      fields: {
        title :{
           en: "Hello"
        }
      }
    }

    const targetContent: PatchableEntry = structuredClone(sourceContent);
    targetContent.fields.title.en = "World";

    expect(createEntryPatch(sourceContent, targetContent)).toStrictEqual([{
      op: "replace",
      path: "/fields/title/en",
      value: "World"
    }]);
  })
  it("create a replace operation for a field with a changed object content", () => {
    const sourceContent: PatchableEntry = {
      ...emptyMetadata,
      fields: {
        title :{
          en: {
            hello: "world"
          }
        }
      }
    }

    const targetContent: PatchableEntry = structuredClone(sourceContent);
    targetContent.fields.title.en.hello = "new world";

    expect(createEntryPatch(sourceContent, targetContent)).toStrictEqual([{
      op: "replace",
      path: "/fields/title/en",
      value: {
        hello: "new world"
      }
    }]);
  })
  it("create a replace operation for tags change", () => {
    const sourceContent: PatchableEntry = {
      metadata: {
        tags: [{sys: {id: "tag1", type: "Link", linkType: "Tag"}}]
      },
      fields: {}
    }

    const targetContent: PatchableEntry = structuredClone(sourceContent);
    targetContent.metadata!.tags[0].sys.id = "tag2";

    expect(createEntryPatch(sourceContent, targetContent)).toStrictEqual([{
      op: "replace",
      path: "/metadata/tags",
      value: [{sys: {id: "tag2", type: "Link", linkType: "Tag"}}]
    }]);
  })

})