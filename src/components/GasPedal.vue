<template>
    <div class="py-2 d-flex justify-center">
        <VProgressCircular :rotate="180" :model-value="value" :color="color" :size="70" :width="12" v-bind="$attrs">
            {{ model.toFixed(2) }}
        </VProgressCircular>
        <SliderValue v-if="withSliders" class="ml-5" v-model="model" />
    </div>
</template>
<script lang="ts">

</script>
<script setup lang="ts">
import { computed } from 'vue';
import SliderValue from './SliderValue.vue';
defineOptions({inheritAttrs: false})
const model = defineModel<number>({
    default: 0
})
defineProps<{ withSliders?: boolean }>()
const value = computed(() => model.value * 100)
const color = computed(() => {
    // Clamp the value between 0 and 1 to prevent errors
    const t = Math.min(Math.max(model.value, 0), 1);
    const hue = t * 150;          // Orange hue
    const saturation = 50 + t * 50; // 0% (gray) to 100% (saturated orange)
    const lightness = 40;    // Standard brightness
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
})
</script>
