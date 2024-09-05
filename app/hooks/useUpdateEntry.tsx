import {useMutation} from "@tanstack/react-query";
import {printVersion} from "~/utils/change-version";
import {EntryDataWithUser} from "~/types";
import {Patch} from "generate-json-patch";
import {createFieldChange} from "~/utils/patch-utils";
import {useInBrowserSdk} from "~/hooks/useInBrowserSdk";
import {EditorAppSDK, SidebarAppSDK} from "@contentful/app-sdk";

export const useUpdateEntry = (sdk: EditorAppSDK | SidebarAppSDK | undefined ) => {

  return useMutation({
    onSuccess: (entry) => {
      sdk?.notifier.success(`Cherry-pick ${printVersion(entry)} successful`)
    },
    onError: (error) => {
      console.warn(error)
      sdk?.notifier.success(`Cherry-pick failed`)
    },
    mutationFn: async (entry: EntryDataWithUser) => {
      const patch = entry.patch as Patch
      await Promise.all(getFieldUpdates(patch, sdk))
      await sdk?.entry.save()
      return entry
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

    switch (change.changeTpe) {
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