import {useInBrowserSdk} from "~/hooks/useInBrowserSdk";
import {SidebarAppSDK} from "@contentful/app-sdk";
import {useRef, useState} from "react";
import {Form, useSubmit} from "@remix-run/react";
import {ExistingSearchParams} from "~/components/ExistingSearchParams";

export function UpdateOnSysChange() {
  const {sdk} = useInBrowserSdk<SidebarAppSDK>()
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(null)
  const updateFormRef = useRef<HTMLFormElement>(null)
  const submit = useSubmit()

  // we should delay this call
  sdk?.entry?.onSysChanged((event) => {
    if (lastUpdatedAt !== event.updatedAt) {
      setLastUpdatedAt(event.updatedAt)
      submit(updateFormRef.current)
    }
  })

  return (
    <Form method="get" ref={updateFormRef} name={UpdateOnSysChange.formName}>
      <ExistingSearchParams/>
    </Form>
  )
}

UpdateOnSysChange.formName = 'update-on-sys-change-form'