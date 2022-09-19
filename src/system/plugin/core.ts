export enum PluginStatus {

    // The status of the plugin (widget).

    INSTALL = "install",
    INSTALLED = "installed",
    ERROR = "error"
}


export enum InstallStatus {

    // The status of the current installation of the plugin (widget).

    INSTALL = "install",
    INSTALLED = "installed",
    NOT_CONFIGURED = "not_configured",
}


export type EntityCallbacks = {
    selected: (...args: any[]) => void;
}


export type PluginCallbacks = {

    /*
        The callback object for the plugin (widget).
        Signatures may be incorrect because the developer is tired of debugging this nightmare.
    */

    [index: string]: any;

    render?: () => boolean;
    init?: () => boolean;
    bind_actions?: () => boolean;
    settings?: () => void;
    onSave?: (arg0: {active: string, fields: any}) => boolean;
    destroy?: () => boolean;

    dpSettings?: () => void;
    advancedSettings?: () => void;
    onSource?: () => void;
    onSalesbotDesignerSave?: () => void;
    onAddAsSource?: () => void;

    leads?: EntityCallbacks;
    contacts?: EntityCallbacks;
    todo?: EntityCallbacks;
}


export interface IPlugin {

    /*
        We separate the concepts of widget and the concept of plugin. 
        What is embedded in amoCRM is called a plugin. 
        And what the user eventually sees is a widget.
    */

    readonly langs: any;
    readonly callbacks: PluginCallbacks;

    render(...args: any[]): any;
    render_template(...args: any[]): any;

    get_version(): string;

    set_status(status: PluginStatus): void;
    get_install_status(): InstallStatus;
    widgetsOverlay(enable: boolean): void;

    i18n(path: string): string;
    set_lang(lang: any): void;

    list_selected(): any;

    get_settings(): any;
    set_settings(settings: any): void;

    add_action(actionType: string, action: (...args: any[]) => void): void;
    add_source(actionType: string, action: (...args: any[]) => Promise<any>): void;

    system(): {
        area: string,
        amouser_id: number,
        amouser: string,
        amohash: string,
    };

    crm_post(
        url: string,
        data: any,
        resolve: (data: any) => void,
        type: string,
        reject: (error: Error) => void,
    ): Promise<any>;
}
