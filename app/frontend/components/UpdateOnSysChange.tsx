import {useInBrowserSdk} from "~/frontend/hooks/useInBrowserSdk";
import {EntrySys, SidebarAppSDK} from "@contentful/app-sdk";
import {useCallback, useEffect, useRef, useState} from "react";
import {Form, useSubmit} from "@remix-run/react";
import {ExistingSearchParams} from "~/frontend/components/ExistingSearchParams";

const TIMEOUT = 1200

/**
 * This component listens for sys changes on the entry and triggers a form submit to re-fetch data
 */
export function UpdateOnSysChange() {
  const {sdk} = useInBrowserSdk<SidebarAppSDK>()
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(null)
  const updateFormRef = useRef<HTMLFormElement>(null)
  const submit = useSubmit()

  const updateListener = useCallback((event:EntrySys) => {
    if (lastUpdatedAt !== event.updatedAt) {
      setTimeout(() => {
        setLastUpdatedAt(event.updatedAt)
        submit(updateFormRef.current)
      }, TIMEOUT)
    }
    // should updateFormRef.current be part of the deps array?
  }, [submit, lastUpdatedAt])

  useEffect(() => {
    if(!sdk?.entry?.onSysChanged) return
    sdk?.entry?.onSysChanged(updateListener)
  }, [sdk?.entry, updateListener]);

  return (
    <Form method="get" ref={updateFormRef} name={UpdateOnSysChange.formName}>
      <ExistingSearchParams/>
    </Form>
  )
}

UpdateOnSysChange.formName = 'update-on-sys-change-form'