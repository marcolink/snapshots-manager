import {json, LoaderFunctionArgs} from "@remix-run/node";
import {useLoaderData} from "@remix-run/react";
import {getEntries} from "~/logic";
import {toRecord} from "~/utils/toRecord";

export const loader = async ({request}: LoaderFunctionArgs) => {
  const q = toRecord(new URL(request.url).searchParams)
  const data = await getEntries({q:{space: q.space}, limit: 100})
  return json({data})
}

export default function Page() {
  const {data} = useLoaderData<typeof loader>()
  return (
    <div className="font-sans p-4">
      <h1 className="text-2xl font-bold">Page</h1>
      <ul className="list-disc mt-4 pl-6 space-y-2">
        {data.filter(e => Array.isArray(e.patch) && e.patch.length).map(entry => {
          return <li key={entry.id}>
            {/*{entry.raw_entry.sys.id}*/}
            {entry.createdAt}
            {entry.operation}
            {entry.space}
            {entry.environment}
            {Array.isArray(entry.patch) ? entry.patch.length : '0'}
            {/*<pre>{JSON.stringify(entry.patch, null, 2)}</pre>*/}
          </li>
        })}
      </ul>
    </div>
  );
}
