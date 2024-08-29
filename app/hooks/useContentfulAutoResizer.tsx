import {useInBrowser} from "~/hooks/useInBrowser";

export function useContentfulAutoResizer() {
  useInBrowser(() => {
    const {startAutoResizer} = window?.__SDK__?.window
    if(typeof startAutoResizer === 'function'){
      startAutoResizer()
    }
  }, [typeof window !== "undefined"])
}