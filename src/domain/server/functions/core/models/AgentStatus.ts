import { CallInfo } from "./CallInfo"
import { CallStatus } from "./CallStatus"


export type AgentStatus = {
    call_status: CallStatus,
    call_info?: CallInfo
}
