import { IServer } from "../core/IServer";
import { post } from "../../../../infrastructure/functions";
import { IncompatibleVersionError} from "../core/errors";
import { InvalidAuthenticationData} from "../core/errors";
import { InvalidCommandParametersError} from "../core/errors";
import { ServerError} from "../core/errors";
import { BadRequestError } from "../core/errors";
import { ServerNotResponsingError} from "../core/errors";
import { UnknownCommandNameError} from "../core/errors";
import { CommandResult } from "../core/models";
import { RequestData } from "../core/models";
import { ResponseData }from "../core/models";

export class ServerImpl implements IServer {

    private serverAddress: string;
    private secretKey: string;

    private amouserEmail: string;
    private amouserId: number;
    private widgetVersion: string;

    private commandCounter: number;

    readonly TIMEOUT = 11000;

    constructor(
        serverAddress: string,
        secretKey: string,
        amouserEmail: string,
        amouserId: number,
        widgetVersion: string,
    ) {
        this.serverAddress = serverAddress;
        this.secretKey = secretKey;

        this.amouserEmail = amouserEmail;
        this.amouserId = amouserId;
        this.widgetVersion = widgetVersion;

        this.commandCounter = 0;
    }

    private resolveWrapper(
        resolveFunc: (arg0: CommandResult) => void,
        rejectFunc: (arg0: ServerError) => void,
    ): (arg0: ResponseData) => void {

        const self = this;

        function wrapper(response: ResponseData) {

            console.debug(`Server: response received: response: '${JSON.stringify(response)}'.`);

            if (!("headers" in response )){
                rejectFunc(new ServerError("Incorrect response."));
                return;
            }
        
            if (!("status_code" in response.headers )){
                rejectFunc(new ServerError("Incorrect response."));
                return;
            }

            if (response.headers.status_code == 200) {
                resolveFunc(response.content.result);
                return;
            }

            if (response.headers.status_code == 400) {
                rejectFunc(new BadRequestError());
            }else if (response.headers.status_code == 401) {
                rejectFunc(new InvalidAuthenticationData());
            } else if (response.headers.status_code == 409) {
                rejectFunc(new IncompatibleVersionError());
            } else if (response.headers.status_code == 404) {
                rejectFunc(new UnknownCommandNameError("plug :("));
            } else if (response.headers.status_code == 410) {
                rejectFunc(new InvalidCommandParametersError("plug :(", {}));
            }
            rejectFunc(new ServerError("Unknown error."));
        }
        return wrapper;
    }

    private rejectWrapper(rejectFunc: (arg0: Error) => void): (arg0: ServerError) => void {
        function wrapper(error: Error) {
            console.debug(`Server: response received: error: '${error.message}'.`);
            rejectFunc(new ServerError(error.message));
        }
        return wrapper;
    }

    public executeCommand(commandName: string, params?: {[index: string]: any}): Promise<CommandResult> {

        const self = this;

        const data: RequestData = {
            headers: {
                amouser_email: this.amouserEmail,
                amouser_id: this.amouserId,
                widget_version: this.widgetVersion
            },
            content: {
                id: this.commandCounter,
                jsonrpc: "2.0",
                method: commandName,
                params: params
            }
        };

        const url = `${this.serverAddress}?secret_key=${this.secretKey}`;

        let promise: Promise<CommandResult> = new Promise((resolve, reject) => {

            setTimeout(() => {
                    reject(new ServerNotResponsingError());
                },
                self.TIMEOUT
            );

            const content = JSON.stringify(data);

            post(
                url,
                { "json": content },
                this.resolveWrapper(resolve, reject),
                "json",
                this.rejectWrapper(reject)
            );
            console.debug(`Server: request sent: url: '${url}'; json: '${content}.`);
        });
        self.commandCounter += 1;
        return promise;
    }
}