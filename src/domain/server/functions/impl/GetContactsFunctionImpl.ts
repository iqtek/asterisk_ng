import { IServer } from "../../server/core/IServer";
import { Contact } from "../core/models/Contact";
import { IGetContactsFunction } from "../core/functions/IGetContactsFunction";
import { standardPromiseWrapper } from "./utils/standardPromiseWrapper";


export class GetContactsFunctionImpl implements IGetContactsFunction {

    private server: IServer;

    constructor(server: IServer) { this.server = server; }

    execute(startWith: string, maxResults: number): Promise<Array<Contact>> {

        const promise = this.server.executeCommand(
            "get_contacts",
            { start_with: startWith, max_results: maxResults }
        );
        return standardPromiseWrapper(promise);
    }
}
