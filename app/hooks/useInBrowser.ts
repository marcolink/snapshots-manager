import {DependencyList, useEffect} from "react";
import { useHydrated } from "remix-utils/use-hydrated";

// https://remix.run/docs/en/main/guides/constraints#initializing-browser-only-apis
export function useInBrowser(func: () => void, dependencies: DependencyList = []) {

  const isHydrated = useHydrated()

  useEffect(() => {
    if (isHydrated) {
      func()
    } else {
      console.warn("This hook can only be used in the browser.")
    }

  }, [isHydrated, ...dependencies])
}