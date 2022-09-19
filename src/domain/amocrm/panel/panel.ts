import { createApp } from "vue";
import App from "./App.vue";

import vSelect from "vue-select";
import 'vue-select/dist/vue-select.css';


export class Panel {

    private app: any;
    private parentElement: Element;
    
    public isInitialized: boolean = false;

    constructor(app: any, parentElement: Element) {
        this.app = app;
        this.parentElement = parentElement;
    };

    initialize() {
        document.body.appendChild(this.parentElement);
        this.app.mount(`#${this.parentElement.id}`);
        this.app.component("v-select", vSelect);
        this.isInitialized = true;
    };

    deinitialize() {
        this.app.unmount();
        document.body.removeChild(this.parentElement);
        this.isInitialized = false;
    };
}


export function panelFactory(): Panel {

    const parentElementId = "asterisk_ng"

    const parentElement = document.createElement('div');
    parentElement.id = parentElementId;

    const app = createApp(App)

    return new Panel(app, parentElement);
}
