export interface IOriginationFunction {
    execute(phone: string): Promise<void>;
}
