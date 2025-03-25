import {Operation, Patch} from "generate-json-patch";
import {describe, expect, it} from "vitest";
import {UserProps} from "contentful-management";
import {render} from "@testing-library/react";
import {PatchEntryWithUser, WebhookEvent} from "~/shared/types";
import {OperationsText} from "~/frontend/components/OperationsText";

describe("operations-text", function () {
  describe("for action 'create'", async function () {
    it("should render message for newly created entry", async function () {
      testIt(
        'create',
        [Operations.Field.ReplaceAllLocales],
        'Marco created a new entry'
      )
    })
  })
  describe("for action 'save and auto_save'", async function () {
    it("should mention one changed field", async function () {
      testIt(
        'auto_save',
        [Operations.Field.ReplaceAllLocales],
        'Marco changed one field'
      )
    })
    it("should mention two changed fields", async function () {
      testIt(
        'auto_save',
        [Operations.Field.ReplaceAllLocales, Operations.Field.ReplaceSingleLocale],
        'Marco changed two fields'
      )
    })
    it("should mention one changed field and changed tags", async function () {
      testIt(
        'auto_save',
        [Operations.Field.ReplaceSingleLocale, Operations.Metadata.ReplaceTags],
        'Marco changed one field and tags'
      )
    })
  })
})

function testIt(operation: WebhookEvent, patch: Patch, text: string | RegExp) {
  const entry = testEntry(operation, patch)
  const {getByText} = render(<OperationsText entry={entry} locales={[]}/>)
  const spanElement = getByText('Marco').closest('span');
  expect(spanElement).toHaveTextContent(text);
}

const User: UserProps = {
  firstName: "Marco",
  lastName: "Link",
  sys: {
    id: "marco",
    type: "User",
    version: 1,
    updatedAt: "2021-09-01T12:00:00Z",
    createdAt: "2021-09-01T12:00:00Z",
  },
  email: "marco@link.com",
  avatarUrl: "https://www.marco.link/avatar.jpg",
  confirmed: true,
  activated: true,
  "2faEnabled": false,
} as UserProps

const Operations: Record<string, Record<string, Operation>> = {
  Field: {
    ReplaceAllLocales: {
      op: 'replace',
      path: '/fields/title',
      value: 'New Title'
    },
    ReplaceSingleLocale: {
      op: 'replace',
      path: '/fields/title',
      value: 'New Title'
    }
  },
  Metadata: {
    ReplaceTags: {
      op: 'replace',
      path: '/metadata/tags',
      value: [
        {
          sys: {
            id: "someTag",
            type: "Link",
            linkType: "Tag"
          }
        }
      ]
    },
    ReplaceConcepts: {
      "op": "replace",
      "path": "/metadata/concepts",
      "value": [
        {
          "sys": {
            "id": "6vhWcceQ5fjh6ymLMrxzdW",
            "type": "Link",
            "linkType": "TaxonomyConcept"
          }
        },
        {
          "sys": {
            "id": "2E5t1Gn5ciDl8SjKRrIRTu",
            "type": "Link",
            "linkType": "TaxonomyConcept"
          }
        },
        {
          "sys": {
            "id": "37LNYk46T47vQz2hR0YY3j",
            "type": "Link",
            "linkType": "TaxonomyConcept"
          }
        }
      ]
    }
  }
} as const

function testEntry(operation: WebhookEvent, patch: Patch): PatchEntryWithUser {
  return {
    patch,
    operation,
    user: User,
    id: 1,
    entry: "cf-entry-id",
    version: 1,
    createdAt: "2021-09-01T12:00:00Z",
    environment: "master",
    space: "space",
    byUser: 'marco',
  }
}