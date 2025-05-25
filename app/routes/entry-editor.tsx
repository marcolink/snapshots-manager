import {LoaderFunctionArgs} from "@remix-run/node";
import {Form, useLoaderData, useSubmit} from "@remix-run/react";
import {useWithContentfulUsers} from "~/frontend/hooks/useWithContentfulUsers";
import {Changelog} from "~/frontend/components/Changelog";
import {Box, Flex} from '@contentful/f36-core';
import {client} from "~/backend/client";
import {ExistingSearchParams} from "~/frontend/components/ExistingSearchParams";
import {UpdateOnSysChange} from "~/frontend/components/UpdateOnSysChange";

import {PatchEntry} from "~/shared/types";
import {parseURLSearchParams} from "~/validations/parse-url-search-params";
import {ScopedQueryParams} from "~/backend/client/validations";

export const loader = async ({request}: LoaderFunctionArgs) => {
  const searchParams = new URL(request.url).searchParams
  try {
    const parsedParams = parseURLSearchParams(ScopedQueryParams, searchParams)
    const data = await client.patch.getMany({
      query: parsedParams,
      limit: 100
    })
    return Response.json({data})

  } catch (error) {
    Response.json({error}, {status: 400})
  }
}

export default function Page() {
  const {data: entries} = useLoaderData<typeof loader>()
  const {data, isUsersLoading} = useWithContentfulUsers<PatchEntry>(entries)
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