import type {DialogExtensionSDK} from "@contentful/app-sdk";
import {useSdk} from "~/utils/useSdk";

export default function Index() {
    const {cma, sdk} = useSdk<DialogExtensionSDK>();
    return (
        <div>Dialog</div>
    )
}
