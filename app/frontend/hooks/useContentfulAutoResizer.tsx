import {useInBrowser} from "~/frontend/hooks/useInBrowser";

export function useContentfulAutoResizer() {
  useInBrowser(() => {
    const startAutoResizer = window?.__SDK__?.window?.startAutoResizer
    if(typeof startAutoResizer === 'function'){
      startAutoResizer()
    }
  }, [typeof window !== "undefined"])
}