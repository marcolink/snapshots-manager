import type {PageExtensionSDK} from "@contentful/app-sdk";
import {Paragraph} from "@contentful/f36-components";
import {LoaderFunction} from "remix";
import {useSdk} from "~/utils/useSdk";
import { Workbench } from '@contentful/f36-workbench';

export const loader: LoaderFunction = ({request, params}) => {
    return new Response(
        JSON.stringify(
            {
                method: request.method
            }
        ), {
            status: 200,
            headers: {}
        }
    );
}

export default function Index() {
    const {cma, sdk} = useSdk<PageExtensionSDK>();
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
