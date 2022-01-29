import {ActionFunction} from "remix";

// POST Request
export const action: ActionFunction = ({request, params}) => {
    console.log(request, params)
    return new Response(null, {
        status: 200,
        headers: {}
    });
}
