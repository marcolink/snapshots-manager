import {useEffect} from "react";

// https://remix.run/docs/en/main/guides/constraints#initializing-browser-only-apis
export function useInBrowser(func: () => void, dependencies = []) {
  useEffect(() => {
    if (typeof document !== "undefined") {
      func()
    } else {
      console.warn("This hook can only be used in the browser.")
    }

  }, dependencies)
}