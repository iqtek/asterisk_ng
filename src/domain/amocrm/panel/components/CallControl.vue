<template>
    <div class="call__control__block">
        <a
            class="contact__link"
            :href="contactLink"
            :disabled="contactLink === null"
        >
            <span class="control__block__text control__block__name">
                {{
                    this.contactName === null
                        ? _i18n("domain.amocrm.panel.unknown_contact")
                        : this.contactName
                }}
            </span>
        </a>
        <span class="control__block__text control__block__phone">
            {{ this.contactPhone }}
        </span>
        <div class="widget__control__components widget__panel__element">
            <span class="control__block__text talk__time">
                {{ this.talkTime }}
            </span>
            <button
                @click="$emit('mute')"
                class="widget__button widget__button__mute"
            >
                <IconBase
                    v-if="this.isMute"
                    iconName="#mic"
                    iconColor="#f1f3f3"
                />
                <IconBase v-else iconName="#mic-slash" iconColor="#f1f3f3" />
            </button>
            <button
                @click="$emit('hold')"
                class="widget__button widget__button__hold"
            >
                <IconBase
                    v-if="this.isHold"
                    iconName="#play--circle-o "
                    iconColor="#f1f3f3"
                />
                <IconBase
                    v-else
                    iconName="#pause--circle-o"
                    iconColor="#f1f3f3"
                />
            </button>

            <button
                @click="$emit('hangup')"
                class="widget__button widget__button__hangup"
            >
                <IconBase iconName="#phone-hangup" iconColor="#bf616a" />
            </button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import IconBase from "./icons/IconBase.vue";
import { i18n } from "../../../../infrastructure/functions";

export default defineComponent({
    components: {
        IconBase,
    },
    props: {
        contactName: {
            type: String,
            requaried: false,
        },
        contactLink: {
            type: String,
            requaried: false,
        },
        contactPhone: {
            type: String,
            requaried: true,
        },
        isHold: {
            type: Boolean,
            requaried: true,
        },
        isMute: {
            type: Boolean,
            requaried: true,
        },
        timestamp: {
            type: Number,
            requaried: true,
        },
    },
    data: () => {
        return {
            updateTimeInterval: null as any,
            talkTime: "00:00" as string,
        };
    },
    methods: {
        _i18n(s: string) {
            return i18n(s);
        },
        updateTime() {
            const totalSeconds = Math.floor(
                (Date.now() - this.timestamp * 1000) / 1000
            );
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;

            var minutesRepr = minutes.toString();
            var secondsRepr = seconds.toString();

            if (minutes < 10) {
                minutesRepr = "0" + minutesRepr;
            }
            if (seconds < 10) {
                secondsRepr = "0" + secondsRepr;
            }
            this.talkTime = `${minutesRepr}:${secondsRepr}`;
        },
    },
    mounted() {
        this.updateTimeInterval = setInterval(this.updateTime, 1000);
    },
    unmounted() {
        clearInterval(this.updateTimeInterval);
    },
});
</script>
<style scoped>
.call__control__block {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}
.contact__link {
    text-decoration: none !important;
    border: none !important;
}

.widget__panel__element {
    margin-bottom: 10px;
}

.control__block__text {
    display: block;
    color: #000000;
    font-size: 18px;
    font-weight: 700;
    font-family: "PT Sans", Arial, sans-serif;
}
.control__block__name {
    color: #000000;
    font-size: 17px;
    margin-bottom: 6px;
}

.control__block__phone {
    color: #00000080;
    font-size: 17px;
    margin-bottom: 8px !important;
}

.talk__time {
    color: #434343;
}

.widget__control__components {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    align-self: stretch;
}
</style>
