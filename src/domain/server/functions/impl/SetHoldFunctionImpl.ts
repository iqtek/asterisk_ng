import { IServer } from "../../server/core/IServer";
import { ISetHoldFunction } from "../core/functions/ISetHoldFunction";
import { standardPromiseWrapper } from "./utils/standardPromiseWrapper";


export class SetHoldFunctionImpl implements ISetHoldFunction {

    private server: IServer;

    constructor(server: IServer) { this.server = server; }

    execute(isHold: boolean): Promise<void> {
        const promise = this.server.executeCommand("set_hold", { is_hold: isHold });
        return standardPromiseWrapper(promise);
    };
}
