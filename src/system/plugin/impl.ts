import { IPlugin } from "./core";
import { PluginCallbacks } from "./core";


function debugDecorator(
    callback: (...args: any[]) => any, 
    callbackName: string,
): (...args: any[]) => any
{
    return function(...args: any[]){
        const callInfo = `Plugin: callback '${callbackName}' called with args: ${JSON.stringify(args)}`;
        try{
            const result = callback(...args);
            console.debug(`${callInfo} returns: ${JSON.stringify(result)}.`);
            return result;
        }catch(e){
            console.debug(`${callInfo} throw: ${e}.`);
            throw e;
        }
    }
}


function returnTrueDecorator(callback: (...args: any[]) => any): (...args: any[]) => any{
    return function(...args){
        const _ = callback(...args);
        return true;
    }
}


function prepareCallbacks(callbacks: PluginCallbacks): PluginCallbacks{

    let cloneCallbacks = Object.assign({}, callbacks);

    const trueCallbacks = ["render", "init", "bind_actions", "onSave", "destroy"];

    trueCallbacks.forEach(element => {
        if(!(element in cloneCallbacks)){
            cloneCallbacks[element] = returnTrueDecorator(
                function(){
                    console.debug(`Plugin: generated stub for ${element}.`)
                }
            );
        }
    });

    for (const callbackName in cloneCallbacks) {
        const callback = cloneCallbacks[callbackName];
        cloneCallbacks[callbackName] = debugDecorator(callback, callbackName);
    };

    return cloneCallbacks;
}


// @ts-ignore
export class ProxyPlugin implements IPlugin{

    /*

        The ProxyPlugin allows you to use amocrm functions 
        (for example Plugin.crm_post) outside of callbacks. 
        This can be useful and may help to avoid mistakes.

        The first callback is always render and it creates all your callbacks, 
        which immediately take effect.

        The 'init' and 'bind_actions' callbacks will be overwritten 
        and specified here to fool the amocrm.

    */
   
    public callbacks: any;

    constructor(createCallbacks: (plugin: IPlugin) => PluginCallbacks) {

        const self = this;

        this.callbacks = {
            render: function(){
                try{
                    // @ts-ignore
                    const callbacks = prepareCallbacks(createCallbacks(self));
                    const result = callbacks.render();
                    self.callbacks = callbacks;
                    return result;
                }catch(e){
                    console.debug("Error during creation of custom callbacks.", e);
                    throw e;
                }
            },
            init: function(){ return true; },
            bind_actions: function () { return true; },
        };
    }
};
