import {EntryData, WebhookActions} from "~/types";
import {useMemo} from "react";

export type Occurrence = Record<WebhookActions, number>
export type OccurrenceEntry = Pick<EntryData, 'operation'>

export function useActionOccurrences(entries: OccurrenceEntry[] = []) {
  return useMemo(() => {
    return  entries?.reduce((acc: Occurrence, entry) => {
      const operation = entry.operation as WebhookActions
      if (acc[operation]) {
        acc[operation]++
      } else {
        acc[operation] = 1
      }
      return acc
    }, {} as Occurrence) || {}
  }, [entries])
}