import { Container } from "typescript-ioc";
import { IOriginationFunction } from "../../server/functions/core/functions/IOriginationFunction";


export function phoneClickCallback(data: any){
    /*
        Callback for a click on a number in contact
    */
    const originationFunction: IOriginationFunction = Container.getValue("IOriginationFunction");
    const promise = originationFunction.execute(data.value);
}
