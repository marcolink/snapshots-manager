import type {SidebarExtensionSDK} from "@contentful/app-sdk";
import {useSdk} from "~/utils/useSdk";

export default function Index() {
    const {cma, sdk} = useSdk<SidebarExtensionSDK>();
    return (
        <div>Entry Sidebar</div>
    )
}
