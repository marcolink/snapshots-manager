// regenerator-runtime has to be the first import!
import "regenerator-runtime/runtime.js";

import type {KnownSDK} from "@contentful/app-sdk";
import {BaseExtensionSDK} from "@contentful/app-sdk/dist/types/api.types";
import type {PlainClientAPI} from "contentful-management";
import {createClient} from "contentful-management";
import {useState} from "react";
import {useInBrowser} from "~/utils/useInBrowser";

export function useSdk<T extends BaseExtensionSDK = KnownSDK>() {
    const [sdk, setSdk] = useState<T>()
    const [cma, setCma] = useState<PlainClientAPI>()


    useInBrowser(() => {
        const globalSDK = window.__SDK__

        if (!globalSDK) {
            console.error("SDK not available!");
            return;
        }

        const cma = createClient(
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
