import {useEffect} from "react";

// if you rely on browser API
// https://remix.run/docs/en/v1/guides/constraints#rendering-with-browser-only-apis
export function useInBrowser(func: () => void, dependencies = []) {
    useEffect(() => func(), dependencies)
}
