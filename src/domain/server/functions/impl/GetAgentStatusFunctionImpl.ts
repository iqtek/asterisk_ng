import { IServer } from "../../server/core/IServer";
import { AgentStatus } from "../core/models/AgentStatus";
import { IGetAgentStatusFunction } from "../core/functions/IGetAgentStatusFunction";
import { standardPromiseWrapper } from "./utils/standardPromiseWrapper";


export class GetAgentStatusFunctionImpl implements IGetAgentStatusFunction {

    private server: IServer;

    constructor(server: IServer) { this.server = server; }

    execute(currentStatus: AgentStatus): Promise<AgentStatus> {
        const promise = this.server.executeCommand("get_agent_status", { current_status: currentStatus });
        return standardPromiseWrapper(promise);
    };
}
