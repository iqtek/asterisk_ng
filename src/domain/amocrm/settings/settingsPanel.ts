import { createApp } from "vue";
import App from "./App.vue";
import { Container } from "typescript-ioc";
import 'vue-select/dist/vue-select.css';


export function handleSettings(): void {

    const app = createApp(App);

    const parentElementId = "asterisk_ng_settings";
    const rootElementClassName = "widget-settings__desc-space";

    const rootElement = document.getElementsByClassName(rootElementClassName)[0];

    /*
        Getting an item with the original amocrm settings.
        It is required in order to put the json with the settings in input 
        and then perform a virtual click on the "save" button.
    */
   
    const hiddenElement = rootElement.getElementsByClassName("widget_settings_block")[0];

    // @ts-ignore
    hiddenElement.style.display = "none";
    Container.bindName("rootElement").to(rootElement);

    const parentElement = document.createElement("div");
    parentElement.id = parentElementId;

    rootElement.appendChild(parentElement);
    app.mount(`#${parentElementId}`);
}
