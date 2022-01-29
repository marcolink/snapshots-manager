import type {EditorExtensionSDK} from "@contentful/app-sdk";
import {useSdk} from "~/utils/useSdk";

export default function Index() {
    const {cma, sdk} = useSdk<EditorExtensionSDK>();
    return (
        <div>Entry Editor</div>
    )
}
