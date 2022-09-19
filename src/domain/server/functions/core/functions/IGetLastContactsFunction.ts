import { Contact } from "../models/Contact";


export interface IGetLastContactsFunction {
    execute(maxResults: number): Promise<Array<Contact>>;
}
