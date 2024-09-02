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
import tokens from "@contentful/f36-tokens";
import {css} from "emotion";

type Data = EntryData & { user?: UserProps }

const detailOperations: WebhookActions[] = ['publish', 'save', 'auto_save', 'create']

const styles = {
  publish: css({
    backgroundColor: tokens.green100,
  }),
  unpublish: css({
    backgroundColor: tokens.yellow100,
  }),
  archive: css({
    backgroundColor: tokens.red100,
  }),
  unarchive: css({
    backgroundColor: tokens.green100,
  }),
  save: css({
    backgroundColor: tokens.blue100,
  }),
  create: css({
    backgroundColor: tokens.blue200,
  }),
}

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
        dateRenderer={(entry) => formatRelativeDateTime(entry.createdAt)}
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
      className={`overflow-clip ${bgColorForOperation(entry.operation as WebhookActions)}`}
      key={`${entry.id} ${entry.operation}`}
    >
      <Flex justifyContent="space-between">
        <Flex>
          <Text fontWeight={'fontWeightDemiBold'}>
            <code>{`${printVersion(entry)}`}</code>
          </Text>
          <Text marginLeft={'spacing2Xs'} marginRight={'spacing2Xs'}> by </Text>
          <User user={entry.user} isLoading={isLoadingUsers}/>
        </Flex>
        <div>{additionalBadge}<OperationBadge operation={entry.operation}/></div>
      </Flex>
      {detailOperations.includes(entry.operation as WebhookActions) &&
          <PatchComponent patch={entry.patch as Patch} locales={locales}/>}
    </Card>
  )
}

function bgColorForOperation(operation: WebhookActions) {
  switch (operation) {
    case 'publish':
      return styles.publish
    case 'unpublish':
      return styles.unpublish
    case 'save':
    case 'auto_save':
      return styles.save
    case 'create':
      return styles.create
    case "archive":
      return styles.archive
    case "unarchive":
      return styles.unarchive
    default:
      return ''
  }
}