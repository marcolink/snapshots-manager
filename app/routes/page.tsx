import {json, LoaderFunctionArgs} from "@remix-run/node";
import {useLoaderData} from "@remix-run/react";
import {getEntries} from "~/logic";
import {toRecord} from "~/utils/toRecord";
import {EntryTable} from "~/components/EntryTable";
import {useWithContentfulUsers} from "~/hooks/useWithContentfulUsers";

export const loader = async ({request}: LoaderFunctionArgs) => {
  // await db.delete(entries);

  const q = toRecord(new URL(request.url).searchParams)
  const data = await getEntries({q: {}})
  return json({data})
}

export default function Page() {
  const {data: entries} = useLoaderData<typeof loader>()
  const {
    data,
  } = useWithContentfulUsers(entries)

  return (
    <div className="p-4">
      <EntryTable entries={data}/>
    </div>
  );
}
