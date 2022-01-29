import {LoaderFunction} from "remix";

export const loader:LoaderFunction = ({ request,params }) =>  {
    console.log(request, params)
    return new Response(null, {
        status: 200,
        headers: {
        }
    });
}
