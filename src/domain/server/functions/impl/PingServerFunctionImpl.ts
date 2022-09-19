import { IServer } from "../../server/core/IServer";
import { CommandResult } from "../../server/core/models"; 
import { IPingServerFunction } from "../core/functions/IPingServerFunction";
import { ServerError } from "../../server/core/errors";
import { ServerNotResponsingError } from "../../server/core/errors";


export class PingServerFunctionImpl implements IPingServerFunction {

    private server: IServer;

    constructor(server: IServer) { this.server = server; }

    execute(): Promise<void> {
        return new Promise((resolve, reject) => {
            const promise = this.server.executeCommand("ping");

            setTimeout(() => {
                reject(new ServerNotResponsingError());
            }, 3000);

            promise.then(
                (commandResult: CommandResult) => {resolve(null)},
                (error: ServerError) => { reject(error) }
            )
        });
    };
}
