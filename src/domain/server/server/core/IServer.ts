import { CommandResult } from "./models";


export interface IServer {
    executeCommand(commandName: string, params?: {[index: string]: any}): Promise<CommandResult>;
}
