import {EntryProps, Link} from "contentful-management";

export function createLink<T extends string>({id, linkType}: Omit<Link<T>['sys'], 'type'>): Link<T> {
  return {
    sys: {
      id,
      linkType,
      type: 'Link'
    }
  }
}

export function createEntryPayload({key, fields = {}}: { key: string, fields?: EntryProps['fields'] }): EntryProps {
  return {
    sys: {
      id: `${key}-entry`,
      version: 1,
      space: createLink({id: `${key}-space`, linkType: 'Space'}),
      environment: createLink({id: `${key}-environment`, linkType: 'Environment'}),
      createdBy: createLink({id: `${key}-user`, linkType: 'User'}),
      contentType: createLink({id: `${key}-content-type`, linkType: 'ContentType'}),
      createdAt: '2021-01-01T00:00:00Z',
      updatedAt: '2022-01-01T00:00:00Z',
      type: 'Entry',
      automationTags: []
    },
    fields,
    metadata: {
      tags: []
    }
  }
}