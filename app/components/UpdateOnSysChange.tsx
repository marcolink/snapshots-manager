import {useInBrowserSdk} from "~/hooks/useInBrowserSdk";
import {EntrySys, SidebarAppSDK} from "@contentful/app-sdk";
import {useCallback, useEffect, useRef, useState} from "react";
import {Form} from "@remix-run/react";
import {ExistingSearchParams} from "~/components/ExistingSearchParams";
import {useDebounceSubmit} from "remix-utils/use-debounce-submit";

export function UpdateOnSysChange() {
  const {sdk} = useInBrowserSdk<SidebarAppSDK>()
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(null)
  const updateFormRef = useRef<HTMLFormElement>(null)
  const submit = useDebounceSubmit()

  const updateListener = useCallback((event: EntrySys) => {
    if (lastUpdatedAt !== event.updatedAt) {
      setLastUpdatedAt(event.updatedAt)
      submit(updateFormRef.current, {
        navigate: false,
        fetcherKey: UpdateOnSysChange.formName,
        debounceTimeout: 1200
      })
    }
  }, [submit, updateFormRef.current])

  useEffect(() => {
    if (!sdk?.entry?.onSysChanged) return
    sdk?.entry?.onSysChanged(updateListener)
  }, [sdk?.entry?.onSysChanged, updateListener]);

  return (
    <Form method="get" ref={updateFormRef} name={UpdateOnSysChange.formName}>
      <ExistingSearchParams/>
    </Form>
  )
}

UpdateOnSysChange.formName = 'update-on-sys-change-form'