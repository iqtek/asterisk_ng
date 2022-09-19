<template>
    <div class="settings__container">
        <header>
            <a href="https://github.com/iqtek" target=”_blank”>
                <AsteriskLogo class="settings__logo" />
            </a>
            <span  v-bind:style="statusStyle" class="current__status">{{ currentStatus }}</span>
        </header>

        <div class="settings__container__main">
            <div class="settings__input__container">
                <div class="input__component">
                    <span class="input__label">
                        {{ _i18n('domain.amocrm.settings.field.server_address') }}
                    </span>
                    <input 
                        @input="onChange" 
                        class="input" 
                        type="text" 
                        placeholder="https://127.0.0.1/asterisk_ng" 
                        v-model="settingsModel.server.serverAddress"
                    >
                </div>
            </div>
            <div class="settings__input__container">
                <div class="input__component">
                    <span class="input__label">
                        {{ _i18n('domain.amocrm.settings.field.secret_key') }}
                    </span>
                    <input 
                        @input="onChange" 
                        class="input" 
                        placeholder="AsteriskNG" 
                        :type="ShowKey ? 'text': 'password'" 
                        v-model="settingsModel.server.secretKey"
                    >
                </div>
                <div class="show__pass__img">
                    <EyeCloseImg @click="ShowKey = !ShowKey" v-if="ShowKey"/>
                    <EyeOpenImg @click="ShowKey = !ShowKey" v-else/>
                </div>
            </div>

            <div class="settings__input__container">
                <input 
                    type="checkbox" 
                    class="settings__checkbox" 
                    id="showPanelCheck" 
                    name="showPanelCheck" 
                    v-model="settingsModel.amocrm.showPanel"
                >
                <label for="showPanelCheck">
                    {{ _i18n('domain.amocrm.settings.field.show_panel_check') }}
                </label>
            </div>
            <div class="settings__input__container">
                <input 
                    type="checkbox" 
                    class="settings__checkbox" 
                    id="enableNotification" 
                    name="enableNotification"
                    v-model="settingsModel.amocrm.enableNotification"
                >
                <label for="enableNotification">
                    {{ _i18n('domain.amocrm.settings.field.enable_notification') }}
                </label>
            </div>
        </div>

        <div class="settings__save__container">
                <button 
                    @click="onSave" 
                    class="save__button"
                    :disabled="isDisabled"
                    v-bind:class="{ save__button__disabled: isDisabled }"
                >
                    {{ _i18n('domain.amocrm.settings.save_button') }}
                </button>
                <div class="save__message__container" v-if="!isDisabled && saveMessage.length > 0" >
                    <div class="save__message__img" v-if="isChecked" >
                        <span class="loader"></span>
                    </div>
                    <div class="save__message__img" v-else>
                        <SuccessImg v-if="checkStatus == CheckStatus.OK " />
                        <ErrorImg v-if="checkStatus == CheckStatus.ERORR" />
                        <CriticalImg v-if="checkStatus == CheckStatus.CRITICAl" />
                    </div>
                    <span class="save__message" v-bind:class="{ save__message__hidden: isChecked }">
                        {{ saveMessage }}
                    </span>
                </div>
        </div>
    </div>
</template>

<script lang="ts">

// @ts-ignore
import AsteriskLogo from './assets/asteriskLogo.svg';
// @ts-ignore
import CriticalImg from './assets/critical.svg';
// @ts-ignore
import SuccessImg from './assets/success.svg';
// @ts-ignore
import ErrorImg from './assets/error.svg';
// @ts-ignore
import EyeOpenImg from './assets/eye_open.svg';
// @ts-ignore
import EyeCloseImg from './assets/eye_close.svg';

import { defineComponent } from "vue";
import { Container} from "typescript-ioc";

import { IPingServerFunction } from "../../server/functions/core/functions/IPingServerFunction";
import { PingServerFunctionImpl } from "../../server/functions/impl/PingServerFunctionImpl";

import { IServer } from "../../server/server/core/IServer";
import { ServerError } from "../../server/server/core/errors";
import { ServerFactory } from "../../server/server/impl/ServerFactory";
import { ServerNotResponsingError } from "../../server/server/core/errors";
import { IncompatibleVersionError } from "../../server/server/core/errors";
import { InvalidAuthenticationData } from "../../server/server/core/errors";

import { SettingsModel } from "../../../infrastructure/settings/models";
import { i18n} from "../../../infrastructure/functions";
import debounce from "lodash.debounce";

enum CheckStatus {
    OK,
    ERORR,
    CRITICAl,
}

export default defineComponent({
    components: {
        AsteriskLogo,
        SuccessImg,
        ErrorImg,
        CriticalImg,
        EyeOpenImg,
        EyeCloseImg
    },
    data(){
        return {
            currentStatus: "" as string,
            statusStyle:{
                color: "#A3BE8C",
            } as object,
            settingsModel: {
                amocrm: {
                    showPanel: true,
                    enableNotification: true,
                },
                server: {
                    serverAddress: "",
                    secretKey: "",
                }
            } as SettingsModel,

            ShowKey: false as boolean,

            isChecked: false as boolean,
            saveMessage: "" as string,
            checkStatus: CheckStatus.OK as CheckStatus,
            CheckStatus: CheckStatus,

            initialSettingsModel: "" as string,
            settingsInput: null as HTMLElement,
            saveButton: null as HTMLElement,
        }
    },
    methods:{
        _i18n(path: string){
            return i18n(path);
        },
        _getPingFunction(serverAddress: string, secretKey: string): IPingServerFunction{
            const serverFactory: ServerFactory = Container.getValue("ServerFactory");
            const server: IServer = serverFactory.getInstance(serverAddress, secretKey);
            return new PingServerFunctionImpl(server);
        },
        onChange: debounce(function(){
            this.isChecked = true;

            const pingFunction: IPingServerFunction = this._getPingFunction(
                this.settingsModel.server.serverAddress, 
                this.settingsModel.server.secretKey
            );
            const promise = pingFunction.execute();

            promise.then(
                (result: void) => {
                    this.saveMessage = this._i18n("domain.amocrm.settings.status.connected");
                    this.checkStatus = CheckStatus.OK;
                    this.isChecked = false;
                },
                (error: ServerError) => {
                    if (error instanceof InvalidAuthenticationData) {
                        this.saveMessage = this._i18n("domain.amocrm.settings.status.invalid_secret_key");
                        this.checkStatus = CheckStatus.ERORR;
                    } else if (error instanceof IncompatibleVersionError) {
                        this.saveMessage = this._i18n("domain.amocrm.settings.status.incompatible_version");
                        this.checkStatus = CheckStatus.ERORR;
                    } else if (error instanceof ServerNotResponsingError) {
                        this.saveMessage = this._i18n("domain.amocrm.settings.status.not_available");
                        this.checkStatus = CheckStatus.CRITICAl;
                    }else{
                        this.saveMessage = this._i18n("domain.amocrm.settings.status.unknown_error");
                        this.checkStatus = CheckStatus.CRITICAl;
                    }
                    this.isChecked = false;
                } 
            );
        }, 250),
        getStatus(){

            const pingFunction: IPingServerFunction = Container.getValue("IPingServerFunction");

            const promise = pingFunction.execute();

            promise.then(
                (result: void) => {
                    this.statusStyle.color="#A3BE8C";
                    this.currentStatus = this._i18n("domain.amocrm.settings.status.connected");
                },
                (error: ServerError) => {
                    if (error instanceof InvalidAuthenticationData) {
                        this.statusStyle.color="#D08770";
                        this.currentStatus = this._i18n("domain.amocrm.settings.status.invalid_secret_key");
                    } else if (error instanceof IncompatibleVersionError) {
                        this.statusStyle.color="#D08770";
                        this.currentStatus = this._i18n("domain.amocrm.settings.status.incompatible_version");
                    } else if (error instanceof ServerNotResponsingError) {
                        this.statusStyle.color="#BF616A";
                        this.currentStatus = this._i18n("domain.amocrm.settings.status.not_available");
                    }else{
                        this.statusStyle.color="#BF616A";
                        this.currentStatus = this._i18n("domain.amocrm.settings.status.unknown_error");
                    }
                } 
            );
        },
        onSave(){
            this.saveSettings(this.settingsModel);
        },
        saveSettings(settingsModel: SettingsModel){
            const json = JSON.stringify(settingsModel);
            this.settingsInput.value = json;
            this.saveButton.click();
        },
        getSettings(): SettingsModel{
            const json = this.settingsInput.value;
            return JSON.parse(json);
        }
    },
    computed: {
        isDisabled(){
            return JSON.stringify(this.settingsModel) === this.initialSettingsModel;
        }
    },
    mounted(){
        const rootElement: any = Container.getValue("rootElement");

        const inputName = SETTINGS_FIELD;

        this.settingsInput = rootElement.querySelector(`input[name=${inputName}]`);
        this.saveButton = rootElement.getElementsByClassName("js-widget-save")[0];

        const self = this;
        
        function setDefaultSettings(){
            self.settingsModel = {
                amocrm: {
                    showPanel: true,
                    enableNotification: true,
                },
                server: {
                    serverAddress: "",
                    secretKey: "",
                }
            };
            self.initialSettingsModel = JSON.stringify(self.settingsModel);

            self.statusStyle.color="#4C566A";
            self.currentStatus = self._i18n("domain.amocrm.settings.status.not_configured");
        }
        if(this.settingsInput.value.length > 0){
            let settings;
            try{
                settings = this.getSettings();
            }catch(e){
                setDefaultSettings();
                return;
            }
            this.settingsModel = settings;
            this.initialSettingsModel = JSON.stringify(this.settingsModel);

            try{
                this.getStatus();
            }catch(e){
                console.debug("getStatusError", e);

                this.statusStyle.color="#4C566A";
                this.currentStatus = this._i18n("domain.amocrm.settings.status.not_configured");
            }

        }else{
            setDefaultSettings();
        }
    }
});

</script>

<style>

.settings__container * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

header{
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    margin-top: 27px;
}

.settings__logo{
    margin-bottom: 10px;
    filter: drop-shadow(5px 5px 50px rgba(255, 137, 16, 0.46));
}

.settings__container__main{
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    margin-bottom: 20px;
}

.current__status{
    display: block;
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 700;
    font-size: 24px;
    line-height: 28px;
    color: #76C235;
    margin-bottom: 44px;
    height: 28px;
}

.settings__input__container{
    display: flex;
    align-items: end;
    justify-content: flex-start;
    margin-bottom: 9px;
}

.settings__input__tooltip{
    position: relative;
    margin-left: 5px;
}

.settings__save__container{
    display: flex;
    align-items: center;
    justify-content: flex-start;
}
.save__button{
    margin-right: 17px;
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 500;
    font-size: 15px;
    line-height: 18px;
    color: #fff;
    width: 97px;
    height: 36px;
    background: #5E81AC;
    border-radius: 3px;
}
.save__button__disabled{
    background: #5e81ac8f;
}
.save__message__container{
    display: flex;
    align-items: center;
    justify-content: flex-start;
}
.save__message__img{
    margin-right: 4px;
}
.save__message{
    width: 100%;
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 500;
    font-size: 13px;
    text-overflow: clip;
    overflow: hidden;
    white-space: nowrap;
    transition: width 0.75s, color 1.5s;
}

.save__message__hidden{
    width: 0px;
    color: transparent;
}

.input__component{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}
.input__label{
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    font-size: 17px;
    line-height: 18px;
    color: #48494a;
    margin-bottom: 2px;
}
.input{
    font-family: 'Roboto';
    font-style: normal;
    font-weight: lighter;
    border: none;
    border-bottom: #C5C5C5 3px solid;
    height: 23px;
    width: 372px;
    padding-left: 1px;
}
.input:focus{
    border-bottom: #908c8c 3px solid;
}

.show__pass__img{
    margin-bottom: 5px;
}
.settings__checkbox {
    position: absolute;
    z-index: -1;
    opacity: 0;
}

/* для элемента label, связанного с .settings__checkbox */
.settings__checkbox+label {
    display: inline-flex;
    align-items: center;
    user-select: none;
}

/* создание в label псевдоэлемента before со следующими стилями */
.settings__checkbox+label::before {
    content: '';
    display: inline-block;
    width: 1em;
    height: 1em;
    flex-shrink: 0;
    flex-grow: 0;
    border: 1px solid #4C566A;
    border-radius: 0.25em;
    margin-right: 0.5em;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 50% 50%;
}

/* стили при наведении курсора на checkbox */
.settings__checkbox:not(:disabled):not(:checked)+label:hover::before {
    border-color: #2E3440;
}


/* стили для чекбокса, находящегося в состоянии checked */
.settings__checkbox:checked+label::before {
    border-color: #2E3440;
    background-color: #A3BE8C;
    background-size: auto;
    background-image: url("data:image/svg+xml,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%3Crect%20width%3D%2224%22%20height%3D%2224%22%20fill%3D%22%23A3BE8C%22%2F%3E%0A%3Cpath%20d%3D%22M7.34848%2011.1156L6.07656%2012.7773L11.7253%2017.1022L18.3404%208.46237L16.679%207.19035L11.3362%2014.1687L7.34848%2011.1156Z%22%20fill%3D%22white%22%2F%3E%0A%3C%2Fsvg%3E%0A");
}

/* стили для чекбокса, находящегося в состоянии disabled */
.settings__checkbox:disabled+label::before {
    background-color: #D8DEE9;
}
.loader__wrapper{
    width: 21px;
    height: 21px;
}
.loader {
    display: block;
    width: 21px;
    height: 21px;
    border-radius: 50%;
    position: relative;
    animation: rotate 1s linear infinite
}
.loader::before {
    content: "";
    box-sizing: border-box;
    position: absolute;
    inset: 0px;
    border-radius: 50%;
    border: 2px solid #4C566A;
    animation: prixClipFix 2s linear infinite ;
}

@keyframes rotate {
    100%   {transform: rotate(360deg)}
}

@keyframes prixClipFix {
    0%   {clip-path:polygon(50% 50%,0 0,0 0,0 0,0 0,0 0)}
    25%  {clip-path:polygon(50% 50%,0 0,100% 0,100% 0,100% 0,100% 0)}
    50%  {clip-path:polygon(50% 50%,0 0,100% 0,100% 100%,100% 100%,100% 100%)}
    75%  {clip-path:polygon(50% 50%,0 0,100% 0,100% 100%,0 100%,0 100%)}
    100% {clip-path:polygon(50% 50%,0 0,100% 0,100% 100%,0 100%,0 0)}
}
</style>
