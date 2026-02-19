<template>
    <span :style="style">
        <slot></slot>
    </span>
</template>
<script setup lang="ts">
import { computed } from 'vue';

const model = defineProps<{ value?: number }>()

const style = computed(() => {
    // Clamp the value between 0 and 1 to prevent errors
    const t = Math.min(Math.max(model.value, 0), 1);
    const hue = 80 - t * 80;          // Orange hue
    const saturation = 100; // 0% (gray) to 100% (saturated orange)
    const lightness = 40;    // Standard brightness
    return {color: `hsl(${hue}, ${saturation}%, ${lightness}%)`};
})
</script>
