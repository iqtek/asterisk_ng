import { IServer } from "../../server/core/IServer";
import { IOriginationFunction } from "../core/functions/IOriginationFunction";
import { standardPromiseWrapper } from "./utils/standardPromiseWrapper";


export class OriginationByContactFunctionImpl implements IOriginationFunction {

    private server: IServer;

    constructor(server: IServer) { this.server = server; }

    execute(contactUUID: string): Promise<void> {
        const promise = this.server.executeCommand("originate_by_contact", { contact_uuid: contactUUID });
        return standardPromiseWrapper(promise);
    };
}
