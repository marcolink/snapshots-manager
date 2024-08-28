import {useInBrowser} from "~/hooks/useInBrowser";
import {useNavigate} from "react-router";
import * as AppSDK from "@contentful/app-sdk";
import {useInBrowserSdk} from "~/hooks/useInBrowserSdk";

export const useAppSdkRouter = () => {
  const navigate = useNavigate();
  const {sdk} = useInBrowserSdk()

  useInBrowser(() => {

    let path = ''

    if (sdk?.location.is(AppSDK.locations.LOCATION_PAGE)) {
      path = '/page'
    } else if (sdk?.location.is(AppSDK.locations.LOCATION_ENTRY_SIDEBAR)) {
      path = '/sidebar'
    } else if (sdk?.location.is(AppSDK.locations.LOCATION_ENTRY_EDITOR)) {
      path = '/entry-editor'
    } else {
      console.warn('Unknown location', sdk?.location)
      return
    }

    const params = new URLSearchParams(sdk?.ids)
    path += `?${params.toString()}`
    console.log(`Navigating to "${path}"`)
    return navigate(path)
  }, [sdk])
}