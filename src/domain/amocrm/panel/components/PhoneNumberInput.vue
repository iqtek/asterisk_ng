<template>
    <div class="phone__input__block">
        <div>
            <v-select
                class="v-select"
                label="name"
                v-model="selected"
                @search="onSearch"
                :filterable="false"
                :options="contacts"
                @input="onInput"
                :clearSearchOnBlur="clearSearchOnBlur"
                :placeholder="_i18n('domain.amocrm.panel.input_hint')"
            >
                <template #option="contact">
                    <div>
                        <h3>{{ contact.name }}</h3>
                        <h5>{{ contact.phone }}</h5>
                    </div>
                </template>
                <template #selected-option="contact">
                    <div>
                        <strong>{{ contact.name }}</strong>
                    </div>
                </template>
                <template #spinner="{ loading }">
                    <div
                        v-if="loading"
                        style="border-left-color: rgba(46, 54, 64, 0.71)"
                        class="vs__spinner"
                    ></div>
                </template>

                <template #no-options="{}">
                    <strong v-once>{{
                        _i18n("domain.amocrm.panel.no_contacts")
                    }}</strong>
                </template>
            </v-select>
        </div>
        <button
            :disabled="isDisabled || disableButton"
            @click="selectPhone"
            v-bind:class="{ widget__button__disabled: isDisabled || disableButton }"
            class="widget__button"
        >
            <IconBase
                v-if="this.isCallControl"
                iconName="#phone-outbound"
                iconColor="#f1f3f3"
            />
            <IconBase v-else iconName="#phone" iconColor="#f1f3f3" />
        </button>
    </div>
</template>

<script lang="ts">

import { defineComponent } from "vue";
import vSelect from "vue-select";
import IconBase from "./icons/IconBase.vue";
import debounce from "lodash.debounce";

import { Container } from "typescript-ioc";

import { IGetLastContactsFunction } from "../../../server/functions/core/functions/IGetLastContactsFunction";
import { IGetContactsFunction } from "../../../server/functions/core/functions/IGetContactsFunction";
import { IOriginationFunction } from "../../../server/functions/core/functions/IOriginationFunction";
import { IOriginationByContactFunction } from "../../../server/functions/core/functions/IOriginationByContactFunction";
import { IRedirectFunction } from "../../../server/functions/core/functions/IRedirectFunction";

import { Contact } from "../../../server/functions/core/models/Contact";
import { i18n } from "../../../../infrastructure/functions";


export default defineComponent({
    components: {
        vSelect,
        IconBase,
    },
    props: {
        isCallControl: {
            type: Boolean,
            requaried: true,
        },
    },
    data: () => {
        return {
            input: "" as string,
            disableButton: false as boolean,
            selected: null as Contact | null,
            contacts: [] as Array<Contact>,
            lastContacts: [] as Array<Contact>,
        };
    },
    methods: {
        clearSearchOnBlur(data: any) {
            return false;
        },
        _i18n(s: string) {
            return i18n(s);
        },
        selectPhone() {
            this.disableButton = true;
            let promise: Promise<any>;

            if (this.isCallControl) {
                
                const redirectCommand: IRedirectFunction = Container.getValue("IRedirectFunction");
                if (!(this.selected === null)) {
                    promise = redirectCommand.execute(this.selected.phone);

                }
                promise = redirectCommand.execute(this.input);

            }else if (!(this.selected === null)) {
                const originationCommand: IOriginationByContactFunction = Container.getValue("IOriginationByContactFunction");
                promise = originationCommand.execute(this.selected.uuid);
            }else{
                const originationCommand: IOriginationFunction = Container.getValue("IOriginationFunction");
                promise = originationCommand.execute(this.input);
            }

            promise.then(
                (result) => {this.disableButton = false;},
                (error) => {this.disableButton = false;}
            )
            return;
        },
        onSearch: debounce(function (
            search: string,
            loading: (arg0: boolean) => void
        ) {
            loading(true);
            const getСontactsСommand: IGetContactsFunction = Container.getValue("IGetContactsFunction");
            const promise = getСontactsСommand.execute(search, 10);
            promise.then(
                (result) => {
                    this.contacts = result;
                    loading(false);
                },
                (error) => {
                    this.contacts = [];
                    loading(false);
                }
            );
        },
        250),
        onInput: function (event: any) {
            this.input = event.target.value;
        },
    },
    computed: {
        isDisabled() {
            return this.selected === null && this.input.length < 3;
        },
        onEmptyInput() {
            if (this.selected === null && this.input.length == 0) {
                this.contacts = this.lastContacts;
            }
        },
    },
    mounted() {
        const getLastСontactsСommand: IGetLastContactsFunction = Container.getValue("IGetLastContactsFunction");
        const promise = getLastСontactsСommand.execute(10);

        promise.then(
            (result) => {
                this.lastContacts = result;
                this.contacts = result;
            },
            (error) => {
                this.lastContacts = [];
            }
        );
    },
});
</script>

<style>
.phone__input__block {
    display: flex;
    justify-content: space-between;
}

.confirm__number__button {
    border-radius: 50%;
    display: flex;
    justify-content: space-between;
}

.confirm__number__button {
    border-radius: 50%;
}

.v-select {
    width: 195px;
    --vs-dropdown-option--active-bg: #f2f2f2;
    --vs-dropdown-option--active-color: black;
}
.vs__search{
    color: black !important;
    opacity: 1 !important;
}
</style>
