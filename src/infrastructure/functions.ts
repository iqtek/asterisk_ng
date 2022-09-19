import { Container } from "typescript-ioc";
import { IPlugin } from "../system/plugin/core";


export function i18n(path: string): string{
    const plugin: IPlugin = Container.getValue("IPlugin");
    return plugin.i18n(path);
}


export function post(
    url: string,
    data: any,
    resolve: (data: any) => void,
    type: string,
    reject: (error: Error) => void,
): Promise<any>{
    const plugin: IPlugin = Container.getValue("IPlugin");
    return plugin.crm_post(url, data, resolve, type, reject);
}
