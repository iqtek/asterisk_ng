export interface IRedirectFunction {
    execute(phone: string): Promise<void>;
}
