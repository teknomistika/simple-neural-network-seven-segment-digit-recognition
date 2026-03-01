<template>
    <VSheet class="traffic-light py-2">
        <!-- RED -->
        <div v-for="(v, i) in model" :key="i" class="d-flex ga-2 justify-center">
            <div class="d-flex align-center">
                <BulbSvg @click="toggle(i)" ref="bulbs" :class="{ bulb: 1, ro: readonly }" />
            </div>
            <div class="d-flex align-center">
                <SliderValue :readonly="readonly" v-if="withSliders" :color="v > 0 ? lightColorRgb[i] : 'grey'"
                    v-model="model[i]" />
                <VChip v-else :color="v > 0 ? lightColorRgb[i] : 'grey'" :value="true" label>
                    <code>{{ v.toFixed(1) }}</code>
                </VChip>
            </div>
        </div>
    </VSheet>

</template>
<script setup lang="ts">
import { onMounted, shallowRef, watch, type GlobalComponents, type Ref } from 'vue';

import SliderValue from './SliderValue.vue';
import { useGlowController } from '@/composables/useGlowController';
import { lightColorRgb } from '@/utils/traffic-light.util';

const model = defineModel<number[]>({
    default: [0, 0, 1]
})
const props = defineProps<{ withSliders?: boolean, readonly?: boolean }>()
const bulbs = shallowRef<GlobalComponents['BulbSvg'][]>()
const bulbControllers: Ref<number>[] = []

watch(model, () => {
    model.value.forEach((v, i) => bulbControllers[i].value = v)
}, { deep: true })

onMounted(() => {
    bulbs.value.forEach((v, i) => {
        const svg = v.$el as SVGElement
        bulbControllers.push(useGlowController(i, svg.querySelector('#x1_glow'), model.value[i]))
    })
})

function toggle(i: number) {
    if (props.readonly) return

    model.value[i] = model.value[i] ? 0 : 1
}

</script>

<style>
/* TRAFFIC LIGHT HOUSING */
.traffic-light .bulb:not(.ro) {
    cursor: pointer;
}
</style>