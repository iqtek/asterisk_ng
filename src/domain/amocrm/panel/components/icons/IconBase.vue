<template>
    <svg class="icon__base" viewBox="0 0 18 18" :width="width" :height="height">
        <use :fill="iconColor" :href="iconName"></use>
    </svg>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    props: {
        iconName: {
            required: true,
            type: String,
        },
        width: {
            required: false,
            type: [Number, String],
        },
        height: {
            required: false,
            type: [Number, String],
        },
        iconColor: {
            type: String,
            default: "currentColor",
        },
    },
});
</script>

<style scoped>
.icon__base {
    display: inline-block;
    line-height: inherit;
    vertical-align: middle;
    fill: currentColor;
    flex-shrink: 0;
    margin-bottom: 3px;
}
</style>
