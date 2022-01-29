import {ActionFunction, LoaderFunction} from "remix";

export const loader: LoaderFunction = ({request, params}) => {
    console.log(request, params)
    return new Response(JSON.stringify({"method": request.method}), {
        status: 200,
        headers: {}
    });
}

// POST Request
export const action: ActionFunction = ({request, params}) => {
    console.log(request, params)
    return new Response(JSON.stringify({"method": request.method}), {
        status: 200,
        headers: {}
    });
}
