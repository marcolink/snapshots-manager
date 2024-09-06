import {useInBrowserSdk} from "~/hooks/useInBrowserSdk";
import {useQuery} from "@tanstack/react-query";
import {BaseAppSDK} from "@contentful/app-sdk/dist/types/api.types";

export function useGetEnvironmentAppInstallations() {
  const {cma, sdk} = useInBrowserSdk<BaseAppSDK>()
  return useQuery({
    initialData: [],
    placeholderData: [],
    enabled: Boolean(cma) && Boolean(sdk?.ids.space) && Boolean(sdk?.ids.app),
    queryKey: ['cma', 'app-id', sdk?.ids.app, 'space', sdk?.ids.space, 'app-installations'],
    queryFn: async () => {
      const appInstallations = await cma?.appInstallation.getForOrganization({
        appDefinitionId: sdk?.ids.app!,
        query: {spaceId: sdk?.ids.space},
      });
      return appInstallations?.includes.Environment || []
    },
  })
}