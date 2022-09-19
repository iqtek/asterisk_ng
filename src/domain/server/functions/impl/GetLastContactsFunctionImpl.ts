import { IServer } from "../../server/core/IServer";
import { Contact } from "../core/models/Contact";
import { IGetLastContactsFunction } from "../core/functions/IGetLastContactsFunction";
import { standardPromiseWrapper } from "./utils/standardPromiseWrapper";


export class GetLastContactsFunctionImpl implements IGetLastContactsFunction {

    private server: IServer;

    constructor(server: IServer) { this.server = server; }

    execute(maxResults: number): Promise<Array<Contact>> {

        const promise = this.server.executeCommand(
            "get_last_contacts",
            { max_results: maxResults }
        );
        return standardPromiseWrapper(promise);

    }
}
