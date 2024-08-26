import {BaseAppSDK} from "@contentful/app-sdk/dist/types/api.types";

declare global {
  interface Window {
    __SDK__: BaseAppSDK;
  }
}