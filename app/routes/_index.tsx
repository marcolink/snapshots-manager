import {json, type MetaFunction} from "@remix-run/node";
import {entries} from "~/database/schema";
import {db} from "~/database";
import {useLoaderData} from "@remix-run/react";
import {useInBrowserSdk} from "~/hooks/useInBrowserSdk";
import {desc} from "drizzle-orm";

export const meta: MetaFunction = () => {
  return [
    {title: "Snapshot Manager"},
    {name: "description", content: "Welcome to Remix!"},
  ];
};

export const loader = async () => {
  const data = await db
    .select()
    .from(entries)
    .limit(10)
    .orderBy(desc(entries.createdAt))
    .execute()
  return json({data})
}

export default function Index() {
  const sdk = useInBrowserSdk()

  const {data} = useLoaderData<typeof loader>()

  return (
    <div className="font-sans p-4">
      <ul className="list-disc mt-4 pl-6 space-y-2">
        {data.map(entry => {
          console.log(entry.patch)
          // @ts-ignore
          return <li key={entry.id}>{entry.raw_entry.sys.id} {entry.createdAt} {entry.space} {entry.environment} {Array.isArray(entry.patch) ? entry.patch.length : '0'}</li>
        })}
      </ul>
    </div>
  );
}
