import { IServer } from "../../server/core/IServer";
import { IHangupFunction } from "../core/functions/IHangupFunction";
import { standardPromiseWrapper } from "./utils/standardPromiseWrapper";


export class HangupFunctionImpl implements IHangupFunction {

    private server: IServer;

    constructor(server: IServer) { this.server = server; }

    execute(): Promise<void> {
        const promise = this.server.executeCommand("hangup");
        return standardPromiseWrapper(promise);
    };
}
