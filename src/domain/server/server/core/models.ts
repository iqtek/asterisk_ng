export type RequestHeaders = {
    amouser_email: string,
    amouser_id: number,
    widget_version: string
};


export type RequestContent = {
    id: number,
    jsonrpc: string,
    method: string,
    params: {[index: string]: any}
};


export type RequestData = {
    headers: RequestHeaders,
    content: RequestContent
};


export type ResponseHeaders = {
    status_code: number,
    detail: string
};


export type CommandResult = {
    result?: any,
    exception_name?: string,
    exception_params?: {[index: string]: any}
};


export type ResponseContent = {
    id: number,
    jsonrpc: string,
    result: CommandResult
};


export type ResponseData = {
    headers: ResponseHeaders,
    content: ResponseContent
};
