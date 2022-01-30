export const successResponse = (payload: any, code = 200) => {
    return new Response(typeof payload === 'string'
            ? payload
            : JSON.stringify(payload),
        {status: code}
    )
}
