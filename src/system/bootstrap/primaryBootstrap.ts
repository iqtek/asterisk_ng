import { Container } from "typescript-ioc";
import { getSystemInfo } from "../../infrastructure/systemInfo";
import { ServerFactory } from "../../domain/server/server/impl/ServerFactory";


export function primaryBootstrap(): void{
    const systemInfo = getSystemInfo();

    const server_factory = new ServerFactory(
        systemInfo.amouserEmail,
        systemInfo.amouserId,
        systemInfo.widgetVersion,
    );

    Container.bindName("SystemInfo").to(systemInfo);
    Container.bindName("ServerFactory").to(server_factory);

}
