import {LoaderFunctionArgs} from "@remix-run/node";
import {Form, useLoaderData} from "@remix-run/react";
import {useContentfulAutoResizer} from "~/frontend/hooks/useContentfulAutoResizer";
import {Note} from "@contentful/f36-note";
import {useWithContentfulUsers} from "~/frontend/hooks/useWithContentfulUsers";
import {client} from "~/backend/client";
import {UpdateOnSysChange} from "~/frontend/components/UpdateOnSysChange";
import {promiseHash} from "remix-utils/promise";
import {Flex} from "@contentful/f36-core";
import {ExistingSearchParams} from "~/frontend/components/ExistingSearchParams";
import {IconButton} from "@contentful/f36-button";
import {CycleIcon} from "@contentful/f36-icons";
import {MiniTimeline} from "~/frontend/components/MiniTimeline";
import {renderOperationIcon} from "~/frontend/components/OperationIcon";
import {Text} from "@contentful/f36-typography";
import {formatRelativeDateTime} from "@contentful/f36-datetime";
import {useInBrowserSdk} from "~/frontend/hooks/useInBrowserSdk";

import {PatchEntry} from "~/shared/types";
import {OperationsText} from "~/frontend/components/OperationsText";

const MAX_VIEW_ITEMS = 50


export const loader = async ({request}: LoaderFunctionArgs) => {
  const searchParams = new URL(request.url).searchParams

  const environment = searchParams.get('environmentAlias') || searchParams.get('environment')

  if(!environment) {
    return Response.json({error: 'No environment provided'}, {status: 400})
  }

  return Response.json(await promiseHash({
    data: client.patch.getMany({
      q: {
        ...searchParams,
        environment
      }, limit: MAX_VIEW_ITEMS
    }),
    metadata: client.patch.getCount({
      q: {
        ...searchParams,
        environment
      }
    })
  }))
}

export default function EntrySidebar() {
  useContentfulAutoResizer()

  const {data: entries, metadata} = useLoaderData<typeof loader>()
  const {data} = useWithContentfulUsers<PatchEntry>(entries)
  const {sdk} = useInBrowserSdk()

  if (data.length === 0) {
    return <Note title={'No snapshots found'}/>
  }

  return (
    <div>
      <UpdateOnSysChange/>
      <MiniTimeline
        entries={data}
        getKey={(entry) => entry.id.toString()}
        iconRenderer={(entry) => renderOperationIcon(entry, true)}
        itemRenderer={entry => (
          <ul>
            <li><Text fontSize={'fontSizeS'}>{formatRelativeDateTime(entry.createdAt)}</Text></li>
            <li><OperationsText entry={entry} locales={sdk?.locales.available || []}/></li>
          </ul>
        )
        }
      />

      {/*<hr className={'mt-5'}/>*/}
      <Form method="get">
        <ExistingSearchParams/>
        <Flex paddingTop={'spacingXs'} justifyContent={'space-between'} alignItems={'center'}>
          <Text>{`Showing last ${Math.min(MAX_VIEW_ITEMS, metadata.count || 0)} of ${metadata.count || 0} snapshots`}</Text>
          <IconButton size={'small'} icon={<CycleIcon/>} aria-label={'reload'} type={'submit'}>reload</IconButton>
        </Flex>
      </Form>
    </div>
  );
}
