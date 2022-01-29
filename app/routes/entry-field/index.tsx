import type {FieldExtensionSDK} from "@contentful/app-sdk";
import {useSdk} from "~/utils/useSdk";

export default function Index() {
    const {cma, sdk} = useSdk<FieldExtensionSDK>();
    return (
        <div>
            <h1>Field Editor</h1>
        </div>
    )
}
