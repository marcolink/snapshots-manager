import {Badge} from "@contentful/f36-badge";
import {Card} from "@contentful/f36-card";
import {Flex} from "@contentful/f36-core";
import {Text} from "@contentful/f36-typography";
import {User} from "~/frontend/components/User";
import {OperationBadge} from "~/frontend/components/OperationBadge";
import {PatchComponent} from "~/frontend/components/PatchComponent";
import {Patch} from "generate-json-patch";
import {Tooltip} from "@contentful/f36-tooltip";
import {IconButton} from "@contentful/f36-button";
import {ArrowUpwardIcon, PreviewIcon} from "@contentful/f36-icons";
import {css} from "emotion";
import tokens from "@contentful/f36-tokens";
import {Conditional} from "~/frontend/components/Conditional";
import {Note} from "@contentful/f36-note";
import {WebhookNoPatchEvent} from "~/shared/streams";
import {printVersion} from "~/frontend/utils/print-version";
import {PatchEntryWithUser, WebhookEvent} from "~/shared/types";

const detailOperations: WebhookEvent[] = ['publish', 'save', 'auto_save', 'create']

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

export function ChangelogEntry(
  {
    entry,
    isLoadingUsers,
    isProd,
    isPrev,
    locales = [],
    onShowPatch,
    onCherryPick
  }: {
    entry: PatchEntryWithUser,
    isProd: boolean,
    isPrev: boolean,
    isLoadingUsers?: boolean,
    locales?: string[],
    onShowPatch: (entry: PatchEntryWithUser) => void
    onCherryPick: (entry: PatchEntryWithUser) => void
  }) {
  let additionalBadge = null
  if (isProd) {
    additionalBadge = <Badge variant={'warning'} className={'mr-1'}>Production</Badge>
  } else if (isPrev) {
    additionalBadge = <Badge variant={'warning'} className={'mr-1'}>Preview</Badge>
  }

  const hasChange = Boolean((entry.patch as Patch).length)
  const isNoPatchAction = WebhookNoPatchEvent.some(e => e === entry.operation)

  return (
    <Card
      className={`${bgColorForOperation(entry.operation)}`}
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

      <Conditional condition={detailOperations.includes(entry.operation) && hasChange}>
        <PatchComponent patch={entry.patch as Patch} locales={locales}/>
      </Conditional>

      <Conditional condition={!hasChange && !isNoPatchAction}>
        <Note variant={'neutral'}>No changes</Note>
      </Conditional>

      <Conditional condition={hasChange && !isNoPatchAction}>
        <Flex marginTop={'spacingM'} justifyContent={'flex-end'} gap={'spacingXs'}>
          <Tooltip content={'Show details'} placement={'top'}>
            <IconButton
              size={'small'}
              variant={'secondary'}
              aria-label={'show details'}
              onClick={() => onShowPatch(entry)}
              icon={<PreviewIcon/>}
            />
          </Tooltip>

          <Tooltip content={hasChange ? 'cherry pick' : 'no changes'} placement={'top'}>
            <IconButton
              isDisabled={!hasChange}
              size={'small'}
              variant={'secondary'}
              aria-label={'cherry pick'}
              onClick={() => onCherryPick(entry)}
              icon={<ArrowUpwardIcon/>}
            />
          </Tooltip>
        </Flex>
      </Conditional>
    </Card>
  )
}

function bgColorForOperation(operation: WebhookEvent) {
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