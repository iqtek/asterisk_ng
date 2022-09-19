import { CommandResult } from "../../../server/core/models";
import { ServerError } from "../../../server/core/errors";


export function standardPromiseWrapper(promise: Promise<CommandResult>): Promise<any>{

    return new Promise((resolve, reject) => {
        promise.then(
            (commandResult: CommandResult) => {
                if ("result" in commandResult) {
                    resolve(commandResult.result);
                }
                if("exception_name" in commandResult){
                    reject(new ServerError(
                        `
                        ${commandResult.exception_name} params: 
                        ${ 'exception_params' in commandResult ? 
                        JSON.stringify(commandResult.exception_params): '{}'}
                        `
                    ));
                }
                reject(new ServerError("Invalid command result."));
            },
            (error: ServerError) => { reject(error) }
        )
    });
}
