import {json, type MetaFunction} from "@remix-run/node";
import {entryTable} from "~/database/schema";
import {db} from "~/database";
import {useLoaderData} from "@remix-run/react";
import {useInBrowserSdk} from "~/hooks/useInBrowserSdk";

export const meta: MetaFunction = () => {
  return [
    {title: "Snapshot Manager"},
    {name: "description", content: "Welcome to Remix!"},
  ];
};

export const loader = async () => {
  const data = await db
    .select()
    .from(entryTable)
    .limit(10)
    .execute()
  return json({data})
}

export default function Index() {
  const sdk = useInBrowserSdk()

  const {data} = useLoaderData<typeof loader>()

  return (
    <div className="font-sans p-4">
      <h1 className="text-3xl">Welcome to Remix</h1>
      <ul className="list-disc mt-4 pl-6 space-y-2">
        {data.map(entry => {
          return <li>{entry.id}</li>
        })}
      </ul>
    </div>
  );
}
