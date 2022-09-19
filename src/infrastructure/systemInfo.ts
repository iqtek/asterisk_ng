import { Container } from "typescript-ioc";
import { IPlugin } from "../system/plugin/core";


export type SystemInfo = {
    amouserId: number,
    amouserEmail: string,
    widgetVersion: string
}


export function getSystemInfo(): SystemInfo{
    const plugin: IPlugin = Container.getValue("IPlugin");

    const system = plugin.system();
    const version = plugin.get_version();

    return {
        amouserId: system.amouser_id,
        amouserEmail: system.amouser,
        widgetVersion: version
    };
}
