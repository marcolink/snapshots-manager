import {LoaderFunctionArgs} from "@remix-run/node";
import {Form, useLoaderData, useSubmit} from "@remix-run/react";
import {useWithContentfulUsers} from "~/frontend/hooks/useWithContentfulUsers";
import {Changelog} from "~/frontend/components/Changelog";
import {Box, Flex} from '@contentful/f36-core';
import {client} from "~/backend/client";
import {StreamKeyDec, StreamKeys} from "~/shared/streams";
import {ExistingSearchParams} from "~/frontend/components/ExistingSearchParams";
import {UpdateOnSysChange} from "~/frontend/components/UpdateOnSysChange";

import {PatchEntry} from "~/shared/types";

export const loader = async ({request}: LoaderFunctionArgs) => {
  const searchParams = new URL(request.url).searchParams
  const stream = StreamKeyDec.catch(StreamKeys.publish).parse(searchParams.get('stream'))

  const environment = searchParams.get('environmentAlias') || searchParams.get('environment')

  if(!environment) {
    return Response.json({error: 'No environment provided'}, {status: 400})
  }

  const data = await client.patch.getMany({
    q: {
      ...searchParams,
      environment,
    }, limit: 100
  })
  return Response.json({data, stream})
}

export default function Page() {
  const {data: entries} = useLoaderData<typeof loader>()
  const {
    data, isUsersLoading,
  } = useWithContentfulUsers<PatchEntry>(entries)

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