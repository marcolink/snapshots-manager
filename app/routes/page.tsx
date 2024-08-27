import {json, LoaderFunctionArgs} from "@remix-run/node";
import {useLoaderData} from "@remix-run/react";
import {getEntries} from "~/logic";
import {toRecord} from "~/utils/toRecord";
import {EntryTable} from "~/components/EntryTable";

export const loader = async ({request}: LoaderFunctionArgs) => {
  // await db.delete(entries);

  const q = toRecord(new URL(request.url).searchParams)
  const data = await getEntries({q: {}})
  return json({data})
}

export default function Page() {
  const {data} = useLoaderData<typeof loader>()
  return (
    <div className="p-4">
      <EntryTable entries={data}/>
    </div>
  );
}
