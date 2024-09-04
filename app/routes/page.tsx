import {json, LoaderFunctionArgs} from "@remix-run/node";
import {Form, useLoaderData, useSubmit} from "@remix-run/react";
import {toRecord} from "~/utils/toRecord";
import {EntryTable} from "~/components/EntryTable";
import {useWithContentfulUsers} from "~/hooks/useWithContentfulUsers";
import {client} from "~/logic";
import {StreamSelect} from "~/components/StreamSelect";
import {StreamKeyDec, StreamKeys} from "~/logic/streams";
import {ExistingSearchParams} from "~/components/ExistingSearchParams";
import {promiseHash} from "remix-utils/promise";
// import {db} from "~/database";
// import {entries} from "~/database/schema";

export const loader = async ({request}: LoaderFunctionArgs) => {
  // await db.delete(entries).execute();

  const q = toRecord(new URL(request.url).searchParams)
  const stream = StreamKeyDec.catch(StreamKeys.publish).parse(q.stream)

  console.log(q.stream, stream)

  return json(await promiseHash({
    stream: Promise.resolve(stream),
    data: client.getEntries({q: {space: q.space, stream}}),
    metadata: client.getEntriesCount({
      q: {
        ...q,
        environment: q.environmentAlias || q.environment,
        stream: stream
      }
    })
  }))
}

export default function Page() {
  const {data: entries, stream, metadata} = useLoaderData<typeof loader>()
  const {
    data, isUsersLoading,
  } = useWithContentfulUsers(entries)

  const submit = useSubmit()

  return (
    <div className="p-4">
      <Form
        method="get"
        onChange={(event) => submit(event.currentTarget)}>
        <StreamSelect selected={stream}/>
        <ExistingSearchParams exclude={['stream']}/>
      </Form>
      <EntryTable entries={data}/>
      {metadata.count}
    </div>
  );
}
