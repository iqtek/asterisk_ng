import { IServer } from "../core/IServer";
import { ServerImpl } from "./ServerImpl";


export class ServerFactory {

    private amouserEmail: string;
    private amouserId: number;
    private widgetVersion: string;

    constructor(
        amouserEmail: string,
        amouserId: number,
        widgetVersion: string,
    ) {
        this.amouserEmail = amouserEmail;
        this.amouserId = amouserId;
        this.widgetVersion = widgetVersion;
    }

    getInstance(serverAddress: string, secretKey: string): IServer {
        return new ServerImpl(
            serverAddress,
            secretKey,
            this.amouserEmail,
            this.amouserId,
            this.widgetVersion,
        )
    }
}
