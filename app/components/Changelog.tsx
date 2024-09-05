import {formatRelativeDateTime} from "@contentful/f36-datetime";
import {EntryDataWithUser} from "~/types";
import {ArrowDownwardIcon, ArrowUpwardIcon, EditIcon, PlusIcon} from "@contentful/f36-icons";
import {Timeline} from "~/components/Timeline";
import {useInBrowserSdk} from "~/hooks/useInBrowserSdk";
import {EditorAppSDK} from "@contentful/app-sdk";
import {EntryDetailsModal} from "~/components/EntryDetailsModal";
import {useCallback, useState} from "react";
import {ChangelogEntry} from "~/components/ChangelogEntry";
import {useUpdateEntry} from "~/hooks/useUpdateEntry";

export function Changelog({entries, isLoadingUsers}: {
  entries: EntryDataWithUser[],
  isLoadingUsers?: boolean,
}) {
  const {sdk} = useInBrowserSdk<EditorAppSDK>()
  const {mutate} = useUpdateEntry(sdk)
  const [isDetailsModalShown, setIsDetailsModalShown] = useState<boolean>(false)
  const [detailsData, setDetailsData] = useState<EntryDataWithUser | null>(null)

  function onShowDetails(entry: EntryDataWithUser) {
    setDetailsData(entry)
    setIsDetailsModalShown(true)
  }

  function onHideDetails() {
    setIsDetailsModalShown(false)
  }

  const onCheryPick = useCallback((entry: EntryDataWithUser) => {
    mutate(entry)
  }, [mutate])

  return (
    <div style={{minWidth: '900px', width: '90%'}}>
      <EntryDetailsModal onClose={onHideDetails} entry={detailsData!} isShown={isDetailsModalShown}/>
      <Timeline
        entries={entries}
        getKey={(entry) => entry.id.toString()}
        iconRenderer={(entry) => {
          if (['auto_save', 'save'].includes(entry.operation)) {
            return {component: <EditIcon variant={'primary'}/>, className: 'bg-blue-200'}
          }
          if (entry.operation === 'publish') {
            return {component: <ArrowUpwardIcon variant={'positive'}/>, className: 'bg-green-200'}
          }
          if (entry.operation === 'unpublish') {
            return {component: <ArrowDownwardIcon variant={'negative'}/>, className: 'bg-gray-200'}
          }
          if (entry.operation === 'create') {
            return {component: <PlusIcon variant={'positive'}/>, className: 'bg-white'}
          }
          return {component: <EditIcon variant={'primary'}/>, className: 'bg-gray-200'}
        }}
        itemRenderer={(entry) => (
          <ChangelogEntry
            onShowPatch={onShowDetails}
            onCherryPick={onCheryPick}
            locales={sdk?.locales.available}
            entry={entry}
            isLoadingUsers={isLoadingUsers}
            isProd={false}
            isPrev={false}
          />
        )}
        dateRenderer={(entry) => formatRelativeDateTime(entry.createdAt)}
      />
    </div>
  );
}
