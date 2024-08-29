import {ActionFunctionArgs, json, LoaderFunctionArgs} from "@remix-run/node";
import {Form, useLoaderData, useActionData} from "@remix-run/react";
import {toRecord} from "~/utils/toRecord";
import {useWithContentfulUsers} from "~/hooks/useWithContentfulUsers";
import {Changelog} from "~/components/Changelog";
import {Heading} from "@contentful/f36-typography";
import {Box, Flex} from '@contentful/f36-core';
import {client} from "~/logic";
import {StreamSelect} from "~/components/StreamSelect";
import {StreamKeyDec, StreamKeys} from "~/logic/streams";

export const loader = async ({request}: LoaderFunctionArgs) => {
  console.log('entity-list LOADER')

  // await db.delete(entries);
  const q = toRecord(new URL(request.url).searchParams)
  const stream = StreamKeyDec.catch(StreamKeys.publish).parse(q.stream)

  const query = {
    q: {
      ...q,
      environment: q.environmentAlias || q.environment,
      stream: stream,
    }, limit: 100
  }

  const data = await client.getEntries({
    q: {
      ...q,
      environment: q.environmentAlias || q.environment,
      stream: stream,
    }, limit: 100
  })
  return json({data, selected: stream, query})
}

export default function Page() {
  const {data: entries, selected} = useLoaderData<typeof loader>()
  const {
    data,
  } = useWithContentfulUsers(entries)

  return (
    <Box padding={'spacingL'}>
      <Heading>Changelog</Heading>
      <Flex justifyContent={'center'}>
        {/*<Form method="post">*/}
        {/* <StreamSelect selected={selected}/>*/}
        {/*</Form>*/}
      </Flex>
      <Changelog entries={data}/>
    </Box>
  );
}