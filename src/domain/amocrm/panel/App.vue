<template>
    <div class="asterisk__panel" draggable="true">
        <SvgBlock />
        <CallControlComponent
            v-if="isCallControlEnabled"
            :contactName="
                'call_info' in this.currentStatus
                    ? this.currentStatus.call_info.contact_name
                    : ''
            "
            :contactPhone="
                'call_info' in this.currentStatus
                    ? this.currentStatus.call_info.contact_phone
                    : ''
            "
            :isMute="
                'call_info' in this.currentStatus
                    ? this.currentStatus.call_info.is_mute
                    : false
            "
            :isHold="
                'call_info' in this.currentStatus
                    ? this.currentStatus.call_info.is_hold
                    : false
            "
            :timestamp="
                'call_info' in this.currentStatus
                    ? this.currentStatus.call_info.timestamp
                    : Math.floor(Date.now() / 1000)
            "
            @mute="setMute"
            @hold="setHold"
            @hangup="hangup"
        />
        <PhoneNumberInput :isCallControl="isCallControlEnabled" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { Container } from "typescript-ioc";
import SvgBlock from "./components/icons/SvgBlock.vue";
import CallControlComponent from "./components/CallControl.vue";
import PhoneNumberInput from "./components/PhoneNumberInput.vue";

import { CallStatus } from "../../server/functions/core/models/CallStatus";
import { IGetAgentStatusFunction } from "../../server/functions/core/functions/IGetAgentStatusFunction";
import { ISetMuteFunction } from "../../server/functions/core/functions/ISetMuteFunction";
import { ISetHoldFunction } from "../../server/functions/core/functions/ISetHoldFunction";
import { IHangupFunction } from "../../server/functions/core/functions/IHangupFunction";

export default defineComponent({
    components: {
        SvgBlock,
        PhoneNumberInput,
        CallControlComponent,
    },
    data() {
        return {
            synchronizationEnabled: false as Boolean,
            currentStatus: { status: CallStatus.NOT_CONVERSATION },
        };
    },
    methods: {
        setMute() {
            const setMuteCommand: ISetMuteFunction = Container.getValue("ISetMuteFunction");
            const isMute = !this.currentStatus.call_info.is_mute;
            setMuteCommand.execute(isMute);
            this.currentStatus.call_info.is_mute = isMute;
        },
        setHold() {
            const setHoldCommand: ISetHoldFunction = Container.getValue("ISetHoldFunction");
            const isHold = !this.currentStatus.call_info.is_hold;
            setHoldCommand.execute(isHold);
            this.currentStatus.call_info.is_hold = isHold;
        },
        hangup() {
            const hangupCommand: IHangupFunction = Container.getValue("IHangupFunction");
            hangupCommand.execute();
            this.currentStatus = { status: CallStatus.NOT_CONVERSATION };
        },
        updateStatus() {
            const getStatusCommand: IGetAgentStatusFunction =Container.getValue("IGetAgentStatusFunction");

            const promise = getStatusCommand.execute(this.currentStatus);
            promise.then(
                (result) => {
                    this.currentStatus = result;

                    if (this.synchronizationEnabled) {
                        setTimeout(this.updateStatus, 500);
                    }
                },
                (error) => {
                    if (this.synchronizationEnabled) {
                        setTimeout(this.updateStatus, 500);
                    }
                }
            );
        },
    },
    computed: {
        isCallControlEnabled() {
            return this.currentStatus.status == CallStatus.CONVERSATION;
        },
    },
    mounted() {
        this.synchronizationEnabled = true;
        this.updateStatus();

        const panel: any =
            document.getElementsByClassName("asterisk__panel")[0];

        panel.onmousedown = function (event: any) {
            if (event.button != 0) {
                return;
            }
            panel.style.position = "absolute";

            const localX = event.pageX - panel.offsetLeft;
            const localY = event.pageY - panel.offsetTop;

            function move_to(x: number, y: number) {
                if(x - localX < 0){
                    panel.style.left = "0px";
                }else{
                    panel.style.left = (x - localX) + "px";
                }

                if(y - localY < 0){
                    panel.style.top = "0px";
                }else{
                    panel.style.top = (y - localY) + "px";
                }
            }
            document.onmousemove = function (event) {
                move_to(event.pageX, event.pageY);
            };
            document.onmouseup = function () {
                document.onmousemove = null;
                panel.onmouseup = null;
            };
            panel.ondragstart = function () {
                return false;
            };
        };
    },
    unmounted() {
        this.synchronizationEnabled = false;
    },
});
</script>

<style>

.asterisk__panel {
    z-index: 999;
    position: relative;
    box-sizing: content-box;
    width: 250px;
    top: 90vh;
    left: calc(100vw - 377px);
    padding: 10px;
    padding-right: 20px;
    border-radius: 5px;
    border-right: solid #ffe116 4px;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    background-color: #ffffffd6;
    box-shadow: 0px 0px 5px 1px rgb(0 0 0 / 40%);
    backdrop-filter: blur(3px);
}

.widget__button {
    border: none;
    border-radius: 50%;
    background: #2e3440;
    border-radius: 50%;
    height: 36px;
    width: 36px;
    padding: 8px;
}

.widget__button__disabled {
    background: #cacaca;
}

.widget__button:active {
    transform: scale(110%, 110%);
}
.control__block__text {
    display: block;
}
.widget__control__block {
    display: block;
}
.widget__panel__element {
    margin-bottom: 10px;
}
.widget__panel__header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
.control__block__text {
    color: #000000;
    font-size: 18px;
    font-weight: 700;
    font-family: "PT Sans", Arial, sans-serif;
}
.panel__header__number {
    color: #000000;
    font-size: 15px;
    margin-bottom: 6px;
}
.talk__time {
    color: #434343;
}
.widget__control__components {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}
</style>
