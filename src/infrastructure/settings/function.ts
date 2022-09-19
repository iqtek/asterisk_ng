import { Container } from "typescript-ioc";
import { SettingsModel } from "./models";
import { IPlugin } from "../../system/plugin/core";
import { InstallStatus } from "../../system/plugin/core";


export function getSettings(): SettingsModel {

    const plugin: IPlugin = Container.getValue("IPlugin");
    const amoSettings = plugin.get_settings();

    if (plugin.get_install_status() == InstallStatus.NOT_CONFIGURED){
        throw Error("Not configured.");
    }

    if (SETTINGS_FIELD in amoSettings){
        try{
            return JSON.parse(amoSettings[SETTINGS_FIELD]);
        }catch(error){
            throw Error("Invalid JSON with settings.");
        }
    }
    throw Error("There are no fields for settings.");
}
