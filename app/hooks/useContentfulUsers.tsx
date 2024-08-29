import {useInBrowserSdk} from "~/hooks/useInBrowserSdk";
import useAsync from "react-use/lib/useAsync";

export function useContentfulUsers(userIds: string[]) {
  const {cma, sdk} = useInBrowserSdk()

  // Can we wrap it in a useInBrowser hook? this hook is constantly breaking HMR
  return useAsync(async () => {
    if(!cma || !sdk) {
      return []
    }

    const result =  await cma?.user.getManyForSpace({
      spaceId: sdk?.ids.space,
      organizationId: sdk?.ids.organization,
      query: {
        'sys.id[in]': userIds
      }
    })

    return result.items
  }, [userIds.toString(), cma, sdk]);


}