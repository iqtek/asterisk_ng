import { Container } from "typescript-ioc";
import { IPlugin } from "./system/plugin/core";
import { PluginCallbacks } from "./system/plugin/core";
import { InstallStatus } from "./system/plugin/core";
import { PluginStatus } from "./system/plugin/core";
import { getSettings } from "./infrastructure/settings/function";
import { handleSettings } from "./domain/amocrm/settings/settingsPanel";
import { phoneClickCallback } from "./domain/amocrm/actions/phoneClickCallback";
import { primaryBootstrap } from "./system/bootstrap/primaryBootstrap";
import { minimalBootstrap } from "./system/bootstrap/minimalBootstrap";
import { totalBootstrap } from "./system/bootstrap/totalBootstrap";
import { SettingsModel } from "./infrastructure/settings/models";


export function createCallbacks(plugin: IPlugin): PluginCallbacks {

    /*
        This function is the main one. 
        Here you need to create all the callbacks for the plugin. 
        Even if you return an empty object, the plugin will 
        put stubs in place of mandatory callbacks. 
        Note that you can call methods from a plugin object outside of callbacks. 
        This behavior is undesirable, but probably useful (thanks to the ProxyPlugin).
    */
   
    Container.bindName("IPlugin").to(plugin);

    primaryBootstrap();

    let pluginError: boolean = false;
    let settings: SettingsModel;

    try {
        settings = getSettings();
    } catch (error) {
        if(plugin.get_install_status() == InstallStatus.INSTALLED){
            plugin.set_status(PluginStatus.ERROR);
        };
        pluginError = true;
    }

    pluginError ? minimalBootstrap(): totalBootstrap(settings);

    plugin.add_action("phone", phoneClickCallback);

    return {
        init: function(){
            if(plugin.get_install_status() == InstallStatus.NOT_CONFIGURED){
                return true;
            }

            try{
                const settings = getSettings();
                if(settings.amocrm.showPanel){
                    const panel = Container.getValue("Panel");
                    panel.initialize();
                }
            }catch(e){

            };
            
            return true;
        },
        settings: function(){
            handleSettings();
            return true;
        },
        onSave: function(){
            try{
                const settings = getSettings();
                Container.bindName("SettingsModel").to(settings);
            }catch(error){
                // Amocrm bug.
            }
            return true;
        },
        destroy(){
            try{
                const panel = Container.getValue("Panel");
                panel.deinitialize();
            }catch(error){};

            return true;
        }
    };
}
