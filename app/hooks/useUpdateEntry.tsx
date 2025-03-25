import {useMutation} from "@tanstack/react-query";
import {printVersion} from "~/utils/change-version";
import {PatchEntryWithUser} from "~/types";
import {Patch} from "generate-json-patch";
import {createFieldChange} from "~/utils/patch-utils";
import {EditorAppSDK, SidebarAppSDK} from "@contentful/app-sdk";
import {ModalConfirm, ModalLauncher} from '@contentful/f36-modal';
import {Text} from "@contentful/f36-typography";

export const useUpdateEntry = (sdk: EditorAppSDK | SidebarAppSDK | undefined ) => {
  return useMutation({
    onSuccess: ({entry, shouldExecute}) => {
      shouldExecute && sdk?.notifier.success(`Cherry-pick ${printVersion(entry)} successful`)
    },
    onError: (error) => {
      console.warn(error)
      sdk?.notifier.success(`Cherry-pick failed`)
    },
    mutationFn: async (entry: PatchEntryWithUser) => {
      const patch = entry.patch as Patch
      const shouldExecute = await ModalLauncher.open(({ isShown, onClose }) => {
        return (
          <ModalConfirm
            title="Apply this change on top of the current entry?"
            intent="positive"
            isShown={isShown}
            onCancel={() => {
              onClose(false);
            }}
            onConfirm={() => {
              onClose(true);
            }}
            confirmLabel="Cherry-pick"
            cancelLabel="Cancel"
          >
            <Text>
              This will apply the <strong>{(entry.patch as Patch).length} change(s)</strong> from the selected snapshot on top of the current entry.
            </Text>
          </ModalConfirm>
        );
      })

      if(shouldExecute) {
        await Promise.all(getFieldUpdates(patch, sdk))
        await sdk?.entry.save()
      }

      return {entry, shouldExecute}
    }
  })
}

function getFieldUpdates(patch: Patch, sdk: EditorAppSDK | SidebarAppSDK | undefined) {

  const fields = patch.filter((operation) => operation.path.startsWith('/fields'))
  const fieldChanges = fields.map((operation) => createFieldChange(operation, sdk?.locales.available))

  const changePromises = []

  for (const change of fieldChanges.flatMap((change) => change)) {
    const fieldAPI = sdk?.entry.fields[change.field]
    if (!fieldAPI) {
      console.warn('Field not found', change.field)
      continue
    }

    if (!change.locale) {
      console.log('no locale', change)
      continue
    }

    switch (change.operation) {
      case 'add':
        console.log('add', change)
        changePromises.push(fieldAPI.setValue(change.value, change.locale))
        break
      case 'replace':
        console.log('replace', change)
        changePromises.push(fieldAPI.setValue(change.value, change.locale))
        break
      case 'remove':
        console.log('remove', change)
        if(change.locale === 'all') {
          sdk.locales.available.forEach((locale) => {
            changePromises.push(fieldAPI.removeValue(locale))
          })
          break
        }
        changePromises.push(fieldAPI.removeValue(change.locale))
        break
      case 'copy':
        console.log('copy', change)
        changePromises.push(fieldAPI.setValue(change.value, change.locale))
        break
    }
  }

  return changePromises
}

// function getMetadataUpdates(patch: Patch) {
//   const {sdk} = useInBrowserSdk<EditorAppSDK | SidebarAppSDK>()
//
//   const fields = patch.filter((operation) => operation.path.startsWith('/metadata'))
//   const fieldChanges = fields.map((operation) => createMetadataChange(operation))
//
//   const changePromises = []
//
//   for (const change of fieldChanges.flatMap((change) => change)) {
//
//     const {success, data: entityType} = z.union([z.literal('concepts'), z.literal('tags')]).safeParse(change.field)
//
//     if(!success) {
//       console.warn('Field not found', change.field)
//       continue
//     }
//
//
//
//     const metadataEntityAPI = sdk?.entry.getMetadata()?.[entityType]
//     if (!metadataEntityAPI) {
//       console.warn('Metadata api not found', change.field)
//       continue
//     }
//
//
//     // switch (change.changeTpe) {
//     //   case 'add':
//     //     console.log('add', change)
//     //     changePromises.push(metadataEntityAPI.setValue(change.value, change.locale))
//     //     break
//     //   case 'replace':
//     //     console.log('replace', change)
//     //     changePromises.push(metadataEntityAPI.setValue(change.value, change.locale))
//     //     break
//     //   case 'remove':
//     //     console.log('remove', change)
//     //     changePromises.push(metadataEntityAPI.removeValue(change.locale))
//     //     break
//     //   case 'copy':
//     //     console.log('copy', change)
//     //     changePromises.push(metadataEntityAPI.setValue(change.value, change.locale))
//     //     break
//     // }
//   }
//
//   return changePromises
// }