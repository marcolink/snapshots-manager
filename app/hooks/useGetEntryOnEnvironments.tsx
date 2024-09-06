import {EditorAppSDK} from "@contentful/app-sdk";
import {useInBrowserSdk} from "~/hooks/useInBrowserSdk";
import {useQuery} from "@tanstack/react-query";

export function useGetEntryOnEnvironments(id: string | undefined, environments: string[]) {
  const {sdk} = useInBrowserSdk<EditorAppSDK>();
  return useQuery({
    enabled: Boolean(sdk) && Boolean(id) && environments.length > 0,
    placeholderData: [],
    initialData: [],
    queryKey: ['cma', sdk?.ids.space, 'environments', environments, 'entries', id],
    queryFn: async () => {
      const environmentEntries = (
        await Promise.allSettled(
          environments.map(async (environment) => {
            return sdk?.cma.entry.get({
              entryId: id!,
              environmentId: environment,
            });
          })))
        .filter(resolvedReq => resolvedReq.status === 'fulfilled')
        .map(resolvedReq => resolvedReq.value);

      return environmentEntries || [];
    },
  });
}