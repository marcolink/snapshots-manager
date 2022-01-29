import {init, KnownSDK} from "@contentful/app-sdk";
import {hydrate, render} from "react-dom";
import { RemixBrowser } from "remix";
import LocalhostWarning from "./components/LocalhostWarning";

init((sdk: KnownSDK) => {
    if (process.env.NODE_ENV === 'development' && window.self === window.top) {
        console.log("render warning")
        const root = document.getElementById('root');
        render(<LocalhostWarning/>, root);
    } else {
        // needed to keep a reference in the browser
        window.__SDK__ = sdk
        hydrate(<RemixBrowser />, document);
    }
})
