// regenerator-runtime has to be the first import!

import {BaseAppSDK} from "@contentful/app-sdk/dist/types/api.types";
import type {PlainClientAPI} from "contentful-management";
import * as contentfulManagement from "contentful-management";
import {useState} from "react";
import {useInBrowser} from "~/hooks/useInBrowser";

export function useInBrowserSdk<T extends BaseAppSDK>() {
  const [sdk, setSdk] = useState<T>()
  const [cma, setCma] = useState<PlainClientAPI>()

  useInBrowser(() => {
    const globalSDK = window.__SDK__

    // Should we switch to stand-alone app?
    if (!globalSDK) {
      console.error("SDK not available!");
      return;
    }

    const cma = contentfulManagement.createClient(
      {apiAdapter: globalSDK.cmaAdapter},
      {
        type: 'plain',
        defaults: {
          environmentId: globalSDK.ids.environment,
          spaceId: globalSDK.ids.space,
        },
      }
    );
    setSdk((globalSDK as unknown as T));
    setCma(cma);
  })

  return {sdk, cma}
}