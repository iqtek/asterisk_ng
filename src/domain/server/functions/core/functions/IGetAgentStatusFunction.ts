import { AgentStatus } from "../models/AgentStatus";


export interface IGetAgentStatusFunction {
    execute(currentStatus: AgentStatus): Promise<AgentStatus>;
}
