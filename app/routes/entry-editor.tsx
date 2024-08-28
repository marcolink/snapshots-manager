import {json, LoaderFunctionArgs} from "@remix-run/node";
import {useLoaderData} from "@remix-run/react";
import {toRecord} from "~/utils/toRecord";
import {useWithContentfulUsers} from "~/hooks/useWithContentfulUsers";
import {Changelog} from "~/components/Changelog";
import {Heading} from "@contentful/f36-typography";
import {Box, Flex} from '@contentful/f36-core';
import {OperationSelect} from "~/components/OperationSelect";
import {client} from "~/logic";

export const loader = async ({request}: LoaderFunctionArgs) => {
  // await db.delete(entries);

  const q = toRecord(new URL(request.url).searchParams)
  const data = await client.getEntries({q: {}})
  return json({data})
}

export default function Page() {
  const {data: entries} = useLoaderData<typeof loader>()
  const {
    data,
  } = useWithContentfulUsers(entries)

  return (
    <Box padding={'spacingL'}>
      <Heading>Changelog</Heading>
      <Flex justifyContent={'center'}>
        <OperationSelect entries={entries}/>
      </Flex>
      <Changelog entries={data}/>
    </Box>
  );
}