export interface ISetHoldFunction {
    execute(isHold: boolean): Promise<void>;
}
