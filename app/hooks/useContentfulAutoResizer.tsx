import {useInBrowser} from "~/hooks/useInBrowser";

export function useContentfulAutoResizer() {
  useInBrowser(() => {
      const {stopAutoResizer, startAutoResizer} = window.__SDK__.window
      console.log("start auto resizer")
      startAutoResizer()
      return () => {
        console.log("stop auto resizer")
        stopAutoResizer()
      }
  }, [window.__SDK__])
}