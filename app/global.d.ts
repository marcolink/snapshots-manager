import {KnownSDK} from "@contentful/app-sdk";

declare global {
    interface Window {
        __SDK__: KnownSDK;
    }
}
