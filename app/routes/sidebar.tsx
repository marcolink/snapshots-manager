import {json, LoaderFunctionArgs} from "@remix-run/node";
import {useLoaderData} from "@remix-run/react";
import {getEntries} from "~/logic";
import {toRecord} from "~/utils/toRecord";
import {useContentfulAutoResizer} from "~/hooks/useContentfulAutoResizer";
import {EntityList} from "@contentful/f36-entity-list";
import {Note} from "@contentful/f36-note";
import {WebhookActions} from "~/types";
import {ComponentProps} from "react";
import {useWithContentfulUsers} from "~/hooks/useWithContentfulUsers";
import {formatRelativeDateTime} from "@contentful/f36-datetime";
import {useInBrowserSdk} from "~/hooks/useInBrowserSdk";
import {SidebarAppSDK} from "@contentful/app-sdk";

export const loader = async ({request}: LoaderFunctionArgs) => {
  const q = toRecord(new URL(request.url).searchParams)
  console.log(q)
  const data = await getEntries({
    q: {
      ...q, environment: q.environmentAlias || q.environment
    }, limit: 100
  })
  return json({data})
}

const OperationMap: Record<WebhookActions, ComponentProps<typeof EntityList.Item>['status']> = {
  create: 'changed',
  auto_save: 'changed',
  publish: 'published',
  archive: 'archived',
  delete: 'archived',
  unarchive: 'changed',
  unpublish: 'changed'
}

export default function Sidebar() {
  useContentfulAutoResizer()

  const {data:entries} = useLoaderData<typeof loader>()
  const {data} = useWithContentfulUsers(entries)

  if(data.length === 0) {
    return <Note title={'No snapshots found'}/>
  }

  return (
    <div>
    <EntityList>
      {data.map(entry => {
        const patchLength = Array.isArray(entry.patch) ? entry.patch.length : 0
        return <EntityList.Item
          key={entry.id}
          thumbnailUrl={entry.user?.avatarUrl}
          withThumbnail={true}
          title={formatRelativeDateTime(entry.createdAt)}
          description={`v${entry.version} | changes: ${patchLength}`}
          status={OperationMap[entry.operation as WebhookActions]}
        />
      })}
    </EntityList>
    </div>
  );
}
