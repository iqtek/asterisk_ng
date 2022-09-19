<template>
    <svg class="svg__block">
        <symbol id="num-pad" viewBox="0 0 16 16">
            <circle cx="3.5" cy="1.5" r="1.5" />
            <circle cx="12.5" cy="1.5" r="1.5" />
            <circle cx="8" cy="1.5" r="1.5" />
            <circle cx="3.5" cy="5.8" r="1.5" />
            <circle cx="12.5" cy="5.8" r="1.5" />
            <circle cx="8" cy="5.8" r="1.5" />
            <circle cx="3.5" cy="10.2" r="1.5" />
            <circle cx="12.5" cy="10.2" r="1.5" />
            <circle cx="8" cy="10.2" r="1.5" />
            <circle cx="8" cy="14.5" r="1.5" />
        </symbol>
        <symbol id="phone-hangup" viewBox="0 0 16 16">
            <path
                d="M13 11.1l-1.4-1.5L9 12.1V6H7v6.2L4.4 9.6 3 11.1l3.6 3.5L8 16l1.4-1.4z"
            />
            <path
                d="M8.3 2c1.8 0 2.9.7 2.9.9l.3 2.1 2.8 1.4s.3.1.4.1c.2 0 1.3-.8 1.3-1.9C16 1.9 14.9 0 8.2 0h-.4C1.1 0 0 1.9 0 4.6c0 1 1.2 1.9 1.3 1.9s.4-.1.4-.1L4.5 5 5 2.9C5 2.7 6.2 2 7.9 2h.4z"
            />
        </symbol>
        <symbol id="phone" viewBox="0 0 16 16">
            <path
                d="M14.9,11.1c-0.1-0.1-0.3-0.2-0.3-0.2l-3.1-1.1L9.5,11c-0.1,0.1-1.6-0.2-2.8-1.5L6.4,9.2C5,7.9,4.6,6.6,4.8,6.4l1.4-1.8
    L5.1,1.4c0,0-0.1-0.3-0.2-0.3C4.8,1,3.2,0.8,2.5,1.5c-2,2-2.6,4.2,2.4,9.3l0.3,0.3c5.1,5,7.2,4.4,9.3,2.4
    C15.2,12.8,15,11.2,14.9,11.1z"
            />
        </symbol>
        <symbol id="mic-slash" viewBox="0 0 16 16">
            <path
                d="M10 2c0-1.1-.9-2-2-2S6 .9 6 2v5l4-4V2zm1.5 6c0 1.9-1.6 3.5-3.5 3.5-.7 0-1.4-.2-1.9-.6l1.1-1.1c.2.1.5.2.8.2 1.1 0 2-.9 2-2V7l6-6-1-1-5 5-3.8 3.8-1.1 1.1L4 11l-4 4 1 1 4-4c.6.4 1.3.8 2 .9v1.6H5V16h6v-1.5H9v-1.6c2.3-.5 4-2.5 4-4.9V7h-1.5v1zm-7 .5V7H3v1c0 .6.1 1.2.3 1.7l1.2-1.2z"
            />
        </symbol>
        <symbol id="mic" viewBox="0 0 16 16">
            <path
                d="M11.5 7v1c0 1.9-1.6 3.5-3.5 3.5S4.5 9.9 4.5 8V7H3v1c0 2.4 1.7 4.4 4 4.9v1.6H5V16h6v-1.5H9v-1.6c2.3-.5 4-2.5 4-4.9V7h-1.5z"
            />
            <path
                d="M8 10c1.1 0 2-.9 2-2V2c0-1.1-.9-2-2-2S6 .9 6 2v6c0 1.1.9 2 2 2z"
            />
        </symbol>
        <symbol id="play--circle-o" viewBox="0 0 16 16">
            <path d="M6 4.5L12 8l-6 3.5v-7z" />
            <path
                d="M8 16c4.4 0 8-3.6 8-8s-3.6-8-8-8-8 3.6-8 8 3.6 8 8 8zM8 2c3.3 0 6 2.7 6 6s-2.7 6-6 6-6-2.7-6-6 2.7-6 6-6z"
            />
        </symbol>
        <symbol id="pause--circle-o" viewBox="0 0 16 16">
            <path d="M5 5h2v6H5V5zm4 0h2v6H9V5z" />
            <path
                d="M8 16c4.4 0 8-3.6 8-8s-3.6-8-8-8-8 3.6-8 8 3.6 8 8 8zM8 2c3.3 0 6 2.7 6 6s-2.7 6-6 6-6-2.7-6-6 2.7-6 6-6z"
            />
        </symbol>
        <symbol id="arrow-target-right" viewBox="0 0 16 16">
            <path d="M15,14V2h-2v12H15z" />
            <path
                d="M6.3,10.8l1.5,1.4L12,8L7.8,3.8L6.3,5.2L8.2,7H1v2h7.2L6.3,10.8z"
            />
        </symbol>
        <symbol id="x--circle-o" viewBox="0 0 16 16">
            <path
                d="M8 16c4.4 0 8-3.6 8-8s-3.6-8-8-8-8 3.6-8 8 3.6 8 8 8zM8 2c3.3 0 6 2.7 6 6s-2.7 6-6 6-6-2.7-6-6 2.7-6 6-6z"
            />
            <path
                d="M11.5 10.1L9.4 8l2.1-2.1-1.4-1.4L8 6.6 5.9 4.5 4.5 5.9 6.6 8l-2.1 2.1 1.4 1.4L8 9.4l2.1 2.1z"
            />
        </symbol>
        <symbol id="phone-outbound" viewBox="0 0 16 16">
            <path
                d="M12.5 2L8 6.5 9.5 8 14 3.5V7h2V0H9v2zm.4 10.4c-.1-.1-.3-.2-.3-.2l-2.9-1-1.8 1.1c-.1.1-1.5-.2-2.6-1.4l-.3-.3C3.7 9.4 3.4 8.2 3.5 8l1.3-1.7-1-2.9s-.1-.3-.2-.3c-.1-.1-1.5-.3-2.2.4C-.5 5.4-1 7.4 3.6 12.1l.3.3c4.7 4.6 6.7 4.1 8.6 2.2.7-.7.5-2.1.4-2.2z"
            />
        </symbol>
    </svg>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({});
</script>

<style scoped>
.svg__block {
    display: none;
}
</style>
