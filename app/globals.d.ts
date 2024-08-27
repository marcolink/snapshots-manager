import {BaseAppSDK} from "@contentful/app-sdk/dist/types/api.types";
import {WindowAPI} from "@contentful/app-sdk";

declare global {
  interface Window {
    __SDK__: BaseAppSDK & {window :WindowAPI};
    startAutoResizer: (params?: any) => void;
    stopAutoResizer: () => void;
  }
}