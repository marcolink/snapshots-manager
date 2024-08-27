import {useInBrowserSdk} from "~/hooks/useInBrowserSdk";
import * as reactUse from "react-use";

export function useContentfulUsers(userIds: string[]) {
  const {cma, sdk} = useInBrowserSdk()

  return reactUse.useAsync(async () => {
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