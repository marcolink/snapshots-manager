import {json, LoaderFunctionArgs} from "@remix-run/node";
import {useLoaderData} from "@remix-run/react";
import {toRecord} from "~/utils/toRecord";
import {EntryTable} from "~/components/EntryTable";
import {useWithContentfulUsers} from "~/hooks/useWithContentfulUsers";
import {client} from "~/logic";

export const loader = async ({request}: LoaderFunctionArgs) => {
  const q = toRecord(new URL(request.url).searchParams)

  const data = await client.getEntries({
    q: {
      space: q.space,
      signature: q.signature || 'unknown'
    }
  })

  return json({data})
}

export default function SignatureMatches() {
  const {data: entries} = useLoaderData<typeof loader>()
  const {
    data, isUsersLoading,
  } = useWithContentfulUsers(entries)

  return (
    <div className="p-4">
      <EntryTable entries={data}/>
    </div>
  );
}
