import { IServer } from "../../server/core/IServer";
import { ISetMuteFunction } from "../core/functions/ISetMuteFunction";
import { standardPromiseWrapper } from "./utils/standardPromiseWrapper";


export class SetMuteFunctionImpl implements ISetMuteFunction {

    private server: IServer;

    constructor(server: IServer) { this.server = server; }

    execute(isMute: boolean): Promise<void> {
        const promise = this.server.executeCommand("set_mute", { is_mute: isMute });
        return standardPromiseWrapper(promise);
    };
}
