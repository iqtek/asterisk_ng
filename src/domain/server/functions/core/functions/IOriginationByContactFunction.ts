export interface IOriginationByContactFunction {
    execute(contactUUID: string): Promise<void>;
}
