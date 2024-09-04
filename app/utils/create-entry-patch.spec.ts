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
        tags: [
          {sys: {id: "tag1", type: "Link", linkType: "Tag"}},
          {sys: {id: "tag2", type: "Link", linkType: "Tag"}},
        ]
      },
      fields: {}
    }

    const targetContent: PatchableEntry = structuredClone(sourceContent);
    targetContent.metadata!.tags.push({sys: {id: "tag3", type: "Link", linkType: "Tag"}});

    expect(createEntryPatch(sourceContent, targetContent)).toStrictEqual([{
      op: "replace",
      path: "/metadata/tags",
      value: [
        {sys: {id: "tag1", type: "Link", linkType: "Tag"}},
        {sys: {id: "tag2", type: "Link", linkType: "Tag"}},
        {sys: {id: "tag3", type: "Link", linkType: "Tag"}},
      ]
    }]);
  })

  it("does not create a patch for the same payload, but with different key order", () => {
    const sourceContent: PatchableEntry = {
      metadata: {
        tags: [
          {
            sys: {
              id: "someTag",
              type: "Link",
              linkType: "Tag"
            }
          }
        ],
        concepts: [
          {
            sys: {
              type: "Link",
              linkType: "TaxonomyConcept",
              id: "2E5t1Gn5ciDl8SjKRrIRTu"
            }
          },
          {
            sys: {
              type: "Link",
              linkType: "TaxonomyConcept",
              id: "6vhWcceQ5fjh6ymLMrxzdW"
            }
          }
        ]
      },
      fields: {}
    }

    const targetContent: PatchableEntry = {
      metadata: {
        tags: [
          {
            sys: {
              linkType: "Tag",
              id: "someTag",
              type: "Link",
            }
          }
        ],
        concepts: [
          {
            sys: {
              type: "Link",
              linkType: "TaxonomyConcept",
              id: "2E5t1Gn5ciDl8SjKRrIRTu"
            }
          },
          {
            sys: {
              type: "Link",
              linkType: "TaxonomyConcept",
              id: "6vhWcceQ5fjh6ymLMrxzdW"
            }
          }
        ]
      },
      fields: {}
    }


    expect(createEntryPatch(sourceContent, targetContent)).toStrictEqual([]);
  })

  it("does detect a concept change when tags are identical by id", () => {
    const sourceContent: PatchableEntry = {
      metadata: {
        tags: [
          {
            sys: {
              id: "someTag",
              type: "Link",
              linkType: "Tag"
            }
          }
        ],
        concepts: [
          {
            sys: {
              type: "Link",
              linkType: "TaxonomyConcept",
              id: "2E5t1Gn5ciDl8SjKRrIRTu"
            }
          },
          {
            sys: {
              type: "Link",
              linkType: "TaxonomyConcept",
              id: "6vhWcceQ5fjh6ymLMrxzdW"
            }
          }
        ]
      },
      fields: {}
    }

    const targetContent: PatchableEntry = {
      metadata: {
        tags: [
          {
            sys: {
              id: "someTag",
              type: "Link",
              linkType: "Tag"
            }
          }
        ],
        concepts: [
          {
            sys: {
              type: "Link",
              linkType: "TaxonomyConcept",
              id: "2E5t1Gn5ciDl8SjKRrIRTu"
            }
          },
          {
            sys: {
              type: "Link",
              linkType: "TaxonomyConcept",
              id: "new"
            }
          }
        ]
      },
      fields: {}
    }

    expect(createEntryPatch(sourceContent, targetContent)).toStrictEqual([
      {
        op: "replace",
        path: "/metadata/concepts",
        value: [
          {
            sys: {
              type: "Link",
              linkType: "TaxonomyConcept",
              id: "2E5t1Gn5ciDl8SjKRrIRTu"
            }
          },
          {
            sys: {
              type: "Link",
              linkType: "TaxonomyConcept",
              id: "new"
            }
          }
        ]
      }
    ]);
  })
})