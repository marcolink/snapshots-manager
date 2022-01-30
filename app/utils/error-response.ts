export class WebhookResponseError extends Error {
    constructor(message: string, public details?: any) {
        super(message);
    }
}

export const errorResponse = (error: WebhookResponseError, code = 400) => {
    return new Response(JSON.stringify(error), {status: code})
}
