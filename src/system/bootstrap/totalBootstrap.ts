import { Container } from "typescript-ioc";

import { SettingsModel } from "../../infrastructure/settings/models";
import { INotifier } from "../../infrastructure/notifier/core";
import { NotifierImpl } from "../../infrastructure/notifier/impl";
import { VoidNotifier } from "../../infrastructure/notifier/impl";

import { ServerMonitorDecorator } from "../../infrastructure/monitoring/ServerMonitorDecorator";

import {panelFactory} from "../../domain/amocrm/panel/panel";

import { IServer } from "../../domain/server/server/core/IServer";
import { ServerFactory } from "../../domain/server/server/impl/ServerFactory";
import { GetAgentStatusFunctionImpl } from "../../domain/server/functions/impl/GetAgentStatusFunctionImpl";
import { GetContactsFunctionImpl } from "../../domain/server/functions/impl/GetContactsFunctionImpl";
import { GetLastContactsFunctionImpl } from "../../domain/server/functions/impl/GetLastContactsFunctionImpl";
import { OriginationByContactFunctionImpl } from "../../domain/server/functions/impl/OriginationByContactFunctionImpl";
import { OriginationFunctionImpl } from "../../domain/server/functions/impl/OriginationFunctionImpl";
import { RedirectFunctionImpl } from "../../domain/server/functions/impl/RedirectFunctionImpl";
import { SetHoldFunctionImpl } from "../../domain/server/functions/impl/SetHoldFunctionImpl";
import { SetMuteFunctionImpl } from "../../domain/server/functions/impl/SetMuteFunctionImpl";
import { HangupFunctionImpl } from "../../domain/server/functions/impl/HangupFunctionImpl";
import { PingServerFunctionImpl } from "../../domain/server/functions/impl/PingServerFunctionImpl";


export function totalBootstrap(settings: SettingsModel){

    if(settings.amocrm.enableNotification){
        Container.bindName("INotifier").to(new NotifierImpl(NOTIFICATON_DELAY))
    }else{
        Container.bindName("INotifier").to(new VoidNotifier())
    }

    serverBootstrap(settings);
    monitoringBootstrap();
    serverFunctionsBootstrap();
    panelBootstrap();
}


function monitoringBootstrap(){
    const server: IServer = Container.getValue("IServer");
    const notifier: INotifier = Container.getValue("INotifier");

    const newServer = new ServerMonitorDecorator(server, notifier);
    Container.bindName("IServer").to(newServer);
}


function panelBootstrap(){
    const panel = panelFactory();
    Container.bindName("Panel").to(panel);
}


function serverBootstrap(settings: SettingsModel): void {

    const serverFactory: ServerFactory = Container.getValue("ServerFactory");

    const server = serverFactory.getInstance(
        settings.server.serverAddress,
        settings.server.secretKey
    );

    Container.bindName("IServer").to(server);
}


function serverFunctionsBootstrap(): void {

    const server: IServer = Container.getValue("IServer");

    Container.bindName("ISetMuteFunction").to(new SetMuteFunctionImpl(server));
    Container.bindName("ISetHoldFunction").to(new SetHoldFunctionImpl(server));
    Container.bindName("IPingServerFunction").to(new PingServerFunctionImpl(server));
    Container.bindName("IGetLastContactsFunction").to(new GetLastContactsFunctionImpl(server));
    Container.bindName("IGetContactsFunction").to(new GetContactsFunctionImpl(server));
    Container.bindName("IOriginationFunction").to(new OriginationFunctionImpl(server));
    Container.bindName("IRedirectFunction").to(new RedirectFunctionImpl(server));
    Container.bindName("IHangupFunction").to(new HangupFunctionImpl(server));
    Container.bindName("IGetAgentStatusFunction").to(new GetAgentStatusFunctionImpl(server));
    Container.bindName("IOriginationByContactFunction").to(new OriginationByContactFunctionImpl(server));
}
