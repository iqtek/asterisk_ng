import { ProxyPlugin } from "./system/plugin/impl";
import { createCallbacks } from "./createCallbacks";


/*
    AmoCRM entry point.
    By default, the `Widget` function itself is a constructor-function.
    In this case, prototyping is used so that the logic of creating a widget 
    can be moved to another module.
*/


export default function Widget() {
    const plugin = new ProxyPlugin(createCallbacks);
    Object.setPrototypeOf(plugin, new.target.prototype);
    return plugin;
}
