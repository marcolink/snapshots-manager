import {useInBrowser} from "~/hooks/useInBrowser";

export function useContentfulAutoResizer() {
  useInBrowser(() => {
      const {startAutoResizer} = window.__SDK__.window
      startAutoResizer()
  }, [window?.__SDK__])
}