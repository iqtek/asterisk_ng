import { IServer } from "../../server/core/IServer";
import { IOriginationFunction } from "../core/functions/IOriginationFunction";
import { standardPromiseWrapper } from "./utils/standardPromiseWrapper";


export class OriginationFunctionImpl implements IOriginationFunction {

    private server: IServer;

    constructor(server: IServer) { this.server = server; }

    execute(phone: string): Promise<void> {
        const promise = this.server.executeCommand("originate", { phone: phone });
        return standardPromiseWrapper(promise);
    };
}
