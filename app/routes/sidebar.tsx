import {json, LoaderFunctionArgs} from "@remix-run/node";
import {Form, useLoaderData} from "@remix-run/react";
import {toRecord} from "~/utils/toRecord";
import {useContentfulAutoResizer} from "~/hooks/useContentfulAutoResizer";
import {Note} from "@contentful/f36-note";
import {useWithContentfulUsers} from "~/hooks/useWithContentfulUsers";
import {client} from "~/logic";
import {UpdateOnSysChange} from "~/components/UpdateOnSysChange";
import {promiseHash} from "remix-utils/promise";
import {Flex} from "@contentful/f36-core";
import {ExistingSearchParams} from "~/components/ExistingSearchParams";
import {IconButton} from "@contentful/f36-button";
import {CycleIcon} from "@contentful/f36-icons";
import {MiniTimeline} from "~/components/MiniTimeline";
import {renderOperationIcon} from "~/components/OperationIcon";
import {Text} from "@contentful/f36-typography";
import {operationsText} from "~/utils/operations-text";
import {formatRelativeDateTime} from "@contentful/f36-datetime";
import {useInBrowserSdk} from "~/hooks/useInBrowserSdk";

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

export default function Sidebar() {
  useContentfulAutoResizer()

  const {data: entries, metadata} = useLoaderData<typeof loader>()
  const {data} = useWithContentfulUsers(entries)

  if (data.length === 0) {
    return <Note title={'No snapshots found'}/>
  }

  const {sdk} = useInBrowserSdk()

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
            <li>{operationsText(entry, sdk?.locales.available || [])}</li>
          </ul>
        )
        }
      />

      <hr className={'mt-5'}/>
      <Form method="get">
        <ExistingSearchParams/>
        <Flex paddingTop={'spacingXs'} justifyContent={'space-between'} alignItems={'center'}>
          <Text>{`Showing last ${MAX_VIEW_ITEMS} of ${metadata.count || 0} snapshots`}</Text>
          <IconButton size={'small'} icon={<CycleIcon/>} aria-label={'reload'} type={'submit'}>reload</IconButton>
        </Flex>
      </Form>
    </div>
  );
}
