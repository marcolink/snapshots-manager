import {LoaderFunctionArgs} from "@remix-run/node";
import {Form, useLoaderData, useSubmit} from "@remix-run/react";
import {toRecord} from "~/utils/toRecord";
import {useWithContentfulUsers} from "~/hooks/useWithContentfulUsers";
import {Changelog} from "~/components/Changelog";
import {Box, Flex} from '@contentful/f36-core';
import {client} from "~/logic";
import {StreamKeyDec, StreamKeys} from "~/logic/streams";
import {ExistingSearchParams} from "~/components/ExistingSearchParams";
import {UpdateOnSysChange} from "~/components/UpdateOnSysChange";
import {EntryData} from "~/types";

export const loader = async ({request}: LoaderFunctionArgs) => {
  const q = toRecord(new URL(request.url).searchParams)
  const stream = StreamKeyDec.catch(StreamKeys.publish).parse(q.stream)

  const data = await client.getEntries({
    q: {
      ...q,
      environment: q.environmentAlias || q.environment,
      // stream: stream,
    }, limit: 100
  })
  return Response.json({data, stream})
}

export default function Page() {
  const {data: entries} = useLoaderData<typeof loader>()
  const {
    data, isUsersLoading,
  } = useWithContentfulUsers<EntryData>(entries)

  const submit = useSubmit()

  return (
    <>
      <UpdateOnSysChange/>
      <Form
        method="get"
        onChange={(event) => submit(event.currentTarget)}>
        <Box padding={'spacingL'}>
          <Flex justifyContent={'center'} flexDirection={'column'} alignItems="center">
            <ExistingSearchParams exclude={['stream']}/>
            <Changelog entries={data} isLoadingUsers={isUsersLoading}/>
          </Flex>
        </Box>
      </Form>
    </>
  );
}