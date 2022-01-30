import {SysLink} from "contentful-management/dist/typings/common-types";

type WithSys = {
    sys: {
        id: string;
        space: SysLink;
        environment: SysLink;
    }
}

export const extractRequestData = async <Payload extends WithSys>(request: Request) => {
    const payload: Payload = await request.json()
    const space = payload.sys.space.sys.id
    const environment = payload.sys.environment.sys.id
    const contentType = payload.sys.id
    return {payload, space, environment, contentType}
}
