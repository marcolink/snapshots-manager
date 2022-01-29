import type {IdsAPI, PageExtensionSDK} from "@contentful/app-sdk";
import {Paragraph} from "@contentful/f36-components";
import {Workbench} from '@contentful/f36-workbench';
import {useFetcher} from "@remix-run/react";
import {useInBrowser} from "~/utils/useInBrowser";
import {useSdk} from "~/utils/useSdk";

export default function Index() {
    const {cma, sdk} = useSdk<PageExtensionSDK>();
    const fetcher = useFetcher();

    useInBrowser(() => fetcher.load(`/api/${sdk?.ids.space}/${sdk?.ids.environment}`))

    /*
    fetcher.state;
    fetcher.type;
    fetcher.submission;
    fetcher.data;
     */

    console.log(fetcher.type)
    console.log(fetcher.state)

    return (
        <Workbench>
            <Workbench.Header
                title={'Page'}
                description={'Page extension'}
            />
            <Workbench.Content type={"full"}>
                <Paragraph>Here goes your content</Paragraph>
            </Workbench.Content>
            <Workbench.Sidebar position="right">

            </Workbench.Sidebar>
        </Workbench>
    )
}
