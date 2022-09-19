import { Contact } from "../models/Contact";


export interface IGetContactsFunction {
    execute(startWith: string, maxResults: number): Promise<Array<Contact>>;
}