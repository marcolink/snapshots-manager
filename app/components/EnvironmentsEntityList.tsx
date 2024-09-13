import {useInBrowserSdk} from "~/hooks/useInBrowserSdk";
import {SidebarAppSDK} from "@contentful/app-sdk";
import {useGetEnvironmentAppInstallations} from "~/hooks/useGetEnvironmentAppInstallations";
import {useGetEntryOnEnvironments} from "~/hooks/useGetEntryOnEnvironments";
import {EntityList} from "@contentful/f36-entity-list";
import {formatRelativeDateTime} from "@contentful/f36-datetime";

type Props = {};

export function EnvironmentsEntityList({}: Props) {
  const {sdk} = useInBrowserSdk<SidebarAppSDK>()

  const {data: appEnvironments, error} = useGetEnvironmentAppInstallations()
  const {data: environmentEntries, status} = useGetEntryOnEnvironments(
    sdk?.ids?.entry,
    appEnvironments.map((environment) => environment.sys.id)
  )

  return (
    <EntityList>
      {environmentEntries.filter(Boolean).map(entry => {
        // const patchLength = Array.isArray(entry.patch) ? entry.patch.length : 0
        return <EntityList.Item
          key={entry!.sys.environment.sys.id}
          // thumbnailUrl={entry.user?.avatarUrl}
          // withThumbnail={true}
          title={`${formatRelativeDateTime(entry!.sys.updatedAt)}`}
          description={entry!.sys.environment.sys.id}
          // status={entry!.sys.version + 1 < entry!.sys.publishedVersion || 0 ? 'published' : 'changed'}
        />
      })}
    </EntityList>
  );
};