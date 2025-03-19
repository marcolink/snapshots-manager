import {formatRelativeDateTime} from "@contentful/f36-datetime";
import {EntryDataWithUser} from "~/types";
import {Timeline} from "~/components/Timeline";
import {useInBrowserSdk} from "~/hooks/useInBrowserSdk";
import {EditorAppSDK} from "@contentful/app-sdk";
import {EntryDetailsModal} from "~/components/EntryDetailsModal";
import {useCallback, useState} from "react";
import {ChangelogEntry} from "~/components/ChangelogEntry";
import {useUpdateEntry} from "~/hooks/useUpdateEntry";
import {Streams} from "~/client/streams";
import {Note} from "@contentful/f36-note";
import {renderOperationIcon} from "~/components/OperationIcon";

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

  if(entries.length === 0) {
    return <Note>Time Machine has not yet recorded any changes. Start editing!</Note>
  }

  return (
    <div style={{minWidth: '900px', width: '90%'}}>
      <EntryDetailsModal onClose={onHideDetails} entry={detailsData!} isShown={isDetailsModalShown}/>
      <Timeline
        entries={entries}
        getKey={(entry) => entry.id.toString()}
        isOdd={(entry) => !Streams.draft.includes(entry.operation)}
        iconRenderer={(entry) => renderOperationIcon(entry)}
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
