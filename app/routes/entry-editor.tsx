import {json, LoaderFunctionArgs} from "@remix-run/node";
import {Form, useLoaderData, useSubmit} from "@remix-run/react";
import {toRecord} from "~/utils/toRecord";
import {useWithContentfulUsers} from "~/hooks/useWithContentfulUsers";
import {Changelog} from "~/components/Changelog";
import {Heading} from "@contentful/f36-typography";
import {Box, Flex} from '@contentful/f36-core';
import {client} from "~/logic";
import {StreamKeyDec, StreamKeys} from "~/logic/streams";
import {StreamSelect} from "~/components/StreamSelect";
import {ExistingSearchParams} from "~/components/ExistingSearchParams";

export const loader = async ({request}: LoaderFunctionArgs) => {
  // await db.delete(entries);
  const q = toRecord(new URL(request.url).searchParams)
  const stream = StreamKeyDec.catch(StreamKeys.publish).parse(q.stream)

  const data = await client.getEntries({
    q: {
      ...q,
      environment: q.environmentAlias || q.environment,
      stream: stream,
    }, limit: 100
  })
  return json({data, stream})
}

export default function Page() {
  const {data: entries, stream} = useLoaderData<typeof loader>()
  const {
    data, isUsersLoading,
  } = useWithContentfulUsers(entries)

  const submit = useSubmit()

  return (
    <Form
      method="get"
      onChange={(event) => submit(event.currentTarget)}>
      <Box padding={'spacingL'}>
        <Heading>Changelog</Heading>
        <Flex justifyContent={'center'} flexDirection={'column'} alignItems="center" >
          <StreamSelect selected={stream}/>
          <ExistingSearchParams exclude={['stream']}/>

          {/*<Form method="post">*/}
          {/* <StreamSelect selected={selected}/>*/}
          {/*</Form>*/}
          <Changelog entries={data} isLoadingUsers={isUsersLoading}/>
        </Flex>
      </Box>
    </Form>
  );
}