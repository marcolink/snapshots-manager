import {formatRelativeDateTime} from "@contentful/f36-datetime";
import {EntryData, WebhookActions} from "~/types";
import {UserProps} from "contentful-management";
import {Card} from "@contentful/f36-card";
import {OperationBadge} from "~/components/OperationBadge";
import {User} from "~/components/User";
import {Patch} from "generate-json-patch";
import {Badge} from "@contentful/f36-badge";
import {ArrowDownwardIcon, ArrowUpwardIcon, EditIcon, PlusIcon} from "@contentful/f36-icons";
import {printVersion} from "~/utils/change-version";
import {Timeline} from "~/components/Timeline";
import {PatchComponent} from "~/components/PatchComponent";
import {useInBrowserSdk} from "~/hooks/useInBrowserSdk";
import {EditorAppSDK} from "@contentful/app-sdk";
import {Flex} from "@contentful/f36-core";
import {Text} from "@contentful/f36-typography";

type Data = EntryData & { user?: UserProps }

const detailOperations: WebhookActions[] = ['publish', 'save', 'auto_save', 'create']

export function Changelog({entries, isLoadingUsers}: {
  entries: Data[],
  isLoadingUsers?: boolean,
}) {
  const {sdk} = useInBrowserSdk<EditorAppSDK>()

  return (
    <div style={{minWidth: '900px', width: '90%'}}>
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
            locales={sdk?.locales.available}
            entry={entry}
            isLoadingUsers={isLoadingUsers}
            isProd={false}
            isPrev={false}
          />
        )}
      />
    </div>
  );
}

function ChangelogEntry({entry, isLoadingUsers, isProd, isPrev, locales = []}: {
  entry: Data,
  isProd: boolean,
  isPrev: boolean,
  isLoadingUsers?: boolean,
  locales?: string[]
}) {
  let additionalBadge = null
  if (isProd) {
    additionalBadge = <Badge variant={'warning'} className={'mr-1'}>Production</Badge>
  } else if (isPrev) {
    additionalBadge = <Badge variant={'warning'} className={'mr-1'}>Preview</Badge>
  }

  return (
    <Card
      className={'overflow-clip'}
      key={`${entry.id} ${entry.operation}`}
    >
      <Flex justifyContent={'space-between'}>
        <Text fontWeight={'fontWeightDemiBold'}>
          <code>{`${printVersion(entry)}`}</code> - {formatRelativeDateTime(entry.createdAt)}</Text>
        <div>{additionalBadge}<OperationBadge operation={entry.operation}/></div>
      </Flex>
      <User user={entry.user} isLoading={isLoadingUsers}/>
      {detailOperations.includes(entry.operation as WebhookActions) &&
          <PatchComponent patch={entry.patch as Patch} locales={locales}/>}
    </Card>
  )
}