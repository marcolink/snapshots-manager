import {formatRelativeDateTime} from "@contentful/f36-datetime";
import {EntryData, WebhookActions} from "~/types";
import {EntryProps, UserProps} from "contentful-management";
import {Card} from "@contentful/f36-card";
import {OperationBadge} from "~/components/OperationBadge";
import {User} from "~/components/User";
import {Patch} from "generate-json-patch";
import {Badge} from "@contentful/f36-badge";
import {
  ArrowDownwardIcon,
  ArrowForwardIcon,
  ArrowUpwardIcon,
  CycleIcon,
  EditIcon,
  PlusIcon
} from "@contentful/f36-icons";
import {printVersion} from "~/utils/change-version";
import {Timeline} from "~/components/Timeline";
import {createFieldChange, PatchComponent} from "~/components/PatchComponent";
import {useInBrowserSdk} from "~/hooks/useInBrowserSdk";
import {EditorAppSDK, EntryFieldAPI} from "@contentful/app-sdk";
import {Flex} from "@contentful/f36-core";
import {Text} from "@contentful/f36-typography";
import tokens from "@contentful/f36-tokens";
import {css} from "emotion";
import {IconButton} from "@contentful/f36-button";
import {Tooltip} from '@contentful/f36-tooltip';
import {ModalConfirm, ModalLauncher} from "@contentful/f36-modal";
import * as FastJSONPatch from 'fast-json-patch'


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


const useActionHandlers = ({entries}: { entries: Data[] }) => {
  const {sdk} = useInBrowserSdk<EditorAppSDK>()

  return {
    onRevert: ({id}: { id: number }) => {
      const entry = entries.find((entry) => entry.id === id)
      if (!entry) {
        console.error('entry not found')
        return
      }

      const entrySys = sdk?.entry?.getSys()
      if (!entrySys) {
        console.error('entry sys not found')
        return
      }

      const entrySnapshot = entry.raw_entry as EntryProps


      ModalLauncher.open(({isShown, onClose}) => {
        return (
          <ModalConfirm
            title={`Revert to entry from ${entrySys.version} to ${printVersion(entry)}`}
            intent="negative"
            isShown={isShown}
            onCancel={() => {
              onClose(false);
            }}
            onConfirm={async () => {
              onClose(true);
              Object.keys(entrySnapshot.fields).forEach((field) => {
                const locales = sdk?.locales.available || []
                console.log('locales', locales)

                for (const locale of locales) {
                  if (entrySnapshot.fields[field][locale]) {
                    sdk?.entry.fields[field].setValue(entrySnapshot.fields[field][locale], locale)
                  }
                }
              })

              // TODO: set metadata

              // return sdk?.cma.entry.update({
              //     spaceId: entrySys.space.sys.id,
              //     environmentId: entrySys.environment.sys.id,
              //     entryId: entrySys.id,
              //     version: entrySys.version,
              //   },
              //   {
              //     ...(entry.raw_entry as any),
              //     sys: entrySys
              //   }
              // )
            }}
            confirmLabel="Revert entry"
            cancelLabel="Cancel"
          >
            <Text>
              Revert entry to a this version. all existing changes will be overwritten, and the entry will have the
              state from this version.
            </Text>
          </ModalConfirm>
        );
      }).then((result) => {
        if (result === true) {
          console.log('confirmed', id)
        }
      });
    },
    onApply: ({id}: { id: number }) => {
      const entry = entries.find((entry) => entry.id === id)
      if (!entry) {
        console.error('entry not found')
        return
      }

      const entrySys = sdk?.entry?.getSys()
      if (!entrySys) {
        console.error('entry sys not found')
        return
      }

      const fieldPatch = (entry.patch as Patch)
        .filter(operation => operation.path.startsWith('/fields'))
      const patchedEntry = FastJSONPatch.applyPatch({fields: sdk?.entry.fields}, fieldPatch).newDocument as unknown as {
        [key: string]: EntryFieldAPI;
      }


      const updates = fieldPatch.flatMap((operation) => createFieldChange(operation, sdk?.locales.available || []))

      ModalLauncher.open(({isShown, onClose}) => {
        return (
          <ModalConfirm
            title={`Apply changes introduced with ${printVersion(entry)}`}
            intent="negative"
            isShown={isShown}
            onCancel={() => {
              onClose(false);
            }}
            onConfirm={async () => {
              onClose(true);

              // updates.length && updates.forEach(({field, locale, value}) => {
              //
              //   const value = patchedEntry[field] ? patchedEntry[field].getValue(locale) : null
              //
              //   sdk?.entry.fields[field].setValue(value, locale)
              // })

              // TODO: set metadata

              // return sdk?.cma.entry.update({
              //     spaceId: entrySys.space.sys.id,
              //     environmentId: entrySys.environment.sys.id,
              //     entryId: entrySys.id,
              //     version: entrySys.version,
              //   },
              //   {
              //     ...(entry.raw_entry as any),
              //     sys: entrySys
              //   }
              // )
            }}
            confirmLabel="Apply entry"
            cancelLabel="Cancel"
          >
            <Text>
              Applies changes introduced with this version. Changes to all fields part of this change will be reverted.
            </Text>
          </ModalConfirm>
        );
      }).then((result) => {
        if (result === true) {
          console.log('confirmed', id)
        }
      });
    }
  }
}

export function Changelog({entries, isLoadingUsers}: {
  entries: Data[],
  isLoadingUsers?: boolean,
}) {
  const {sdk} = useInBrowserSdk<EditorAppSDK>()
  const {onApply, onRevert} = useActionHandlers({entries})

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
            onRevert={onRevert}
            onApply={onApply}
          />
        )}
        dateRenderer={(entry) => formatRelativeDateTime(entry.createdAt)}
      />
    </div>
  );
}

function ChangelogEntry({entry, isLoadingUsers, isProd, isPrev, locales = [], onRevert, onApply}: {
  entry: Data,
  isProd: boolean,
  isPrev: boolean,
  isLoadingUsers?: boolean,
  locales?: string[],
  onRevert: ReturnType<typeof useActionHandlers>['onRevert']
  onApply: ReturnType<typeof useActionHandlers>['onApply']
}) {
  let additionalBadge = null
  if (isProd) {
    additionalBadge = <Badge variant={'warning'} className={'mr-1'}>Production</Badge>
  } else if (isPrev) {
    additionalBadge = <Badge variant={'warning'} className={'mr-1'}>Preview</Badge>
  }

  return (
    <Card
      className={`${bgColorForOperation(entry.operation as WebhookActions)}`}
      key={`${entry.id} ${entry.operation}`}
      // actions={actions}
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

      <Flex marginTop={'spacingM'} gap={'spacingXs'}>
        <Tooltip placement="top" id={'revert'} content={'apply this version on top of all changes'}>
          <IconButton
            variant={'secondary'}
            aria-label={'revert to this version'}
            size={'small'}
            icon={<CycleIcon/>}
            onClick={() => onRevert({id: entry.id})}
          />
        </Tooltip>
        <Tooltip placement="top" id={'apply'} content={'apply this change on top of all changes'}>
          <IconButton
            variant={'secondary'}
            aria-label={'revert this change'}
            size={'small'}
            icon={<ArrowForwardIcon/>}
            onClick={() => onApply({id: entry.id})}
          />
        </Tooltip>
      </Flex>
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