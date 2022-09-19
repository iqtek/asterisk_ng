import { IServer } from "../../domain/server/server/core/IServer";
import { CommandResult } from "../../domain/server/server/core/models";
import { ServerError } from "../../domain/server/server/core/errors";
import { INotifier } from "../notifier/core";
import { i18n } from "../functions";


export class ServerMonitorDecorator implements IServer{

    private server: IServer;
    private notifier: INotifier;

    private resolveCounter: number;
    private rejectCounter: number;

    private CHECK_COOLDOWN: number = 5000;
    private RESOLVED_SHARE: number = 0.75;

    constructor(server: IServer, notifier: INotifier){
        this.notifier = notifier;
        this.server = server;

        this.resolveCounter = 0;
        this.rejectCounter = 0;

        setInterval(
            () => { this.check() }, 
            this.CHECK_COOLDOWN
        );
    }

    executeCommand(commandName: string, params?: {[index: string]: any}): Promise<CommandResult>{
        const self = this;

        return new Promise((resolve, reject) => {
            const promise = self.server.executeCommand(commandName, params);
            promise.then(
                (result: any) => {
                    self.resolveCounter++;
                    resolve(result);
                },
                (error: ServerError) => {
                    self.rejectCounter++;
                    reject(error);
                }
            );
        });
    };
    
    check(): void{
        const total = this.resolveCounter + this.rejectCounter;

        if (total == 0){return;}

        if (this.resolveCounter / total < this.RESOLVED_SHARE){
            this.notifier.notify_error(
                i18n("domain.amocrm.notification.not_available.header"),
                i18n("domain.amocrm.notification.not_available.text"),
            );
        }

        this.resolveCounter = 0;
        this.rejectCounter = 0;
    }
}