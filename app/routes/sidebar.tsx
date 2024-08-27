import {json, LoaderFunctionArgs} from "@remix-run/node";
import {useLoaderData} from "@remix-run/react";
import {getEntries} from "~/logic";
import {toRecord} from "~/utils/toRecord";
import {useContentfulAutoResizer} from "~/hooks/useContentfulAutoResizer";

export const loader = async ({request}: LoaderFunctionArgs) => {
  const q = toRecord(new URL(request.url).searchParams)
  console.log(q)
  const data = await getEntries({q: {
    ...q, environment: q.environmentAlias || q.environment
    }, limit: 100})
  return json({data})
}

export default function Sidebar() {
  useContentfulAutoResizer()
  const {data} = useLoaderData<typeof loader>()

  console.log(data)

  return (
    <div className="font-sans p-4">
      <ul className="list-disc mt-4 pl-6 space-y-2">
        {data.filter(e => Array.isArray(e.patch) && e.patch.length).map(entry => {
          console.log(entry)
          return <li key={entry.id}>
            {entry.createdAt} {Array.isArray(entry.patch) ? entry.patch.length : '0'}
          </li>
        })}
      </ul>
    </div>
  );
}
