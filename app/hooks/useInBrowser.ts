import {DependencyList, useEffect} from "react";

// https://remix.run/docs/en/main/guides/constraints#initializing-browser-only-apis
export function useInBrowser(func: () => void, dependencies: DependencyList = []) {
  useEffect(() => {
    if (typeof document !== "undefined" && typeof window !== "undefined") {
      func()
    } else {
      console.warn("This hook can only be used in the browser.")
    }

  }, [typeof window !== "undefined", ...dependencies])
}