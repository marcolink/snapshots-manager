import {ActionFunctionArgs, json, LoaderFunctionArgs} from "@remix-run/node";
import {Form, useLoaderData, useSubmit} from "@remix-run/react";
import {toRecord} from "~/utils/toRecord";
import {EntryTable} from "~/components/EntryTable";
import {useWithContentfulUsers} from "~/hooks/useWithContentfulUsers";
import {client} from "~/logic";
import {StreamSelect} from "~/components/StreamSelect";
import {StreamKeyDec, StreamKeys} from "~/logic/streams";
import {ExistingSearchParams} from "~/components/ExistingSearchParams";

export const loader = async ({request}: LoaderFunctionArgs) => {
  // await db.delete(entries);

  console.log('entity-list LOADER')

  const q = toRecord(new URL(request.url).searchParams)
  const stream = StreamKeyDec.catch(StreamKeys.publish).parse(q.stream)

  console.log(q.stream, stream)

  const data = await client.getEntries({q: {space: q.space, stream}})
  return json({data, stream})
}

export const action = async ({request}: ActionFunctionArgs) => {
  console.log('entity-list ACTION')
  return json({data: []})
}

export default function Page() {
  const {data: entries, stream} = useLoaderData<typeof loader>()
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
      </Form>
      <EntryTable entries={data}/>
      <ExistingSearchParams exclude={['stream']}/>
    </div>
  );
}
