import {json, LoaderFunctionArgs} from "@remix-run/node";
import {useLoaderData} from "@remix-run/react";
import {toRecord} from "~/utils/toRecord";
import {useContentfulAutoResizer} from "~/hooks/useContentfulAutoResizer";
import {EntityList} from "@contentful/f36-entity-list";
import {Note} from "@contentful/f36-note";
import {WebhookActions} from "~/types";
import {ComponentProps} from "react";
import {useWithContentfulUsers} from "~/hooks/useWithContentfulUsers";
import {formatRelativeDateTime} from "@contentful/f36-datetime";
import {client} from "~/logic";
import {UpdateOnSysChange} from "~/components/UpdateOnSysChange";
import {promiseHash} from "remix-utils/promise";
import {Box} from "@contentful/f36-core";
import {isPublishStream} from "~/logic/streams";
import {printVersion} from "~/utils/change-version";

const MAX_VIEW_ITEMS = 10

export const loader = async ({request}: LoaderFunctionArgs) => {
  const q = toRecord(new URL(request.url).searchParams)

  return json(await promiseHash({
    data: client.getEntries({
      q: {
        ...q, environment: q.environmentAlias || q.environment
      }, limit: MAX_VIEW_ITEMS
    }),
    metadata: client.getEntriesCount({
      q: {
        ...q, environment: q.environmentAlias || q.environment
      }
    })
  }))
}

const OperationMap: Record<WebhookActions, ComponentProps<typeof EntityList.Item>['status']> = {
  create: 'changed',
  auto_save: 'changed',
  save: 'changed',
  publish: 'published',
  archive: 'archived',
  delete: 'archived',
  unarchive: 'changed',
  unpublish: 'changed'
}

export default function Sidebar() {
  useContentfulAutoResizer()

  const {data: entries, metadata} = useLoaderData<typeof loader>()
  const {data} = useWithContentfulUsers(entries)

  if (data.length === 0) {
    return <Note title={'No snapshots found'}/>
  }

  return (
    <div>
      <UpdateOnSysChange/>
      <EntityList>
        {data.map(entry => {
          const patchLength = Array.isArray(entry.patch) ? entry.patch.length : 0
          return <EntityList.Item
            key={entry.id}
            thumbnailUrl={entry.user?.avatarUrl}
            withThumbnail={true}
            title={formatRelativeDateTime(entry.createdAt)}
            description={`${printVersion(entry)} | changes: ${patchLength}`}
            status={OperationMap[entry.operation as WebhookActions]}
          />
        })}
      </EntityList>
      {metadata.count > MAX_VIEW_ITEMS && (
        <Box paddingTop={'spacingM'}>
          <Note>{`Showing last 10 of ${metadata.count} snapshots`}</Note>
        </Box>
      )}
    </div>
  );
}
