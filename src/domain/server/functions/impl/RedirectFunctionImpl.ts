import { IServer } from "../../server/core/IServer";
import { IRedirectFunction } from "../core/functions/IRedirectFunction";
import { standardPromiseWrapper } from "./utils/standardPromiseWrapper";


export class RedirectFunctionImpl implements IRedirectFunction {

    private server: IServer;

    constructor(server: IServer) { this.server = server; }

    execute(phone: string): Promise<void> {
        const promise = this.server.executeCommand("redirect", { phone: phone })
        return standardPromiseWrapper(promise);
    };
}
