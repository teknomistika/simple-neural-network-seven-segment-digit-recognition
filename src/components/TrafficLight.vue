<template>
    <VSheet class="py-2">
        <!-- RED -->
        <div v-for="(v, i) in model" :key="i" class="d-flex ga-2 justify-center">
            <div class="light-socket py-1">
                <BulbSvg @click="toggle(i)" ref="bulbs" />

            </div>
            <div class="light-slider d-flex align-center">
                <SliderValue :readonly="readonly" v-if="withSliders" :color="v > 0 ? lightColors[i] : 'grey'"
                    v-model="model[i]" />
                <VChip v-else :color="v > 0 ? lightColors[i] : 'grey'" :value="true" label>
                    <code>{{ v.toFixed(1) }}</code>
                </VChip>
            </div>
        </div>
    </VSheet>

</template>
<script setup lang="ts">
import { onMounted, shallowRef, watch, type ComponentPublicInstance, type Ref } from 'vue';
import BulbSvg from './Bulb.svg'
import SliderValue from './SliderValue.vue';
import { glowController, lightColors, trafficLightStyle } from '@/utils/traffic-light.util';

const model = defineModel<number[]>({
    default: [0, 0, 1]
})
const props = defineProps<{ withSliders?: boolean, readonly?: boolean }>()
function toggle(i: number) {
    if (props.readonly) return

    model.value[i] = model.value[i] ? 0 : 1
}
watch(model, () => {
    model.value.forEach((v, i) => bulbControllers[i].value = v)
}, { deep: true })
const bulbs = shallowRef<ComponentPublicInstance[]>()
const bulbControllers: Ref<number>[] = []

onMounted(() => {
    bulbs.value.forEach((v, i) => {
        const svg = v.$el as SVGElement
        // console.log( 'C', v)
        bulbControllers.push(glowController(i, svg.querySelector('#x1_glow'), model.value[i]))
    })
})
</script>

<style>
/* TRAFFIC LIGHT HOUSING */
.light-slider:has(.v-slider) {
    flex: 1;
}

.light-socket {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
}

.light-socket .bezel {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    /* background: radial-gradient(circle at 35% 35%, #2a2e3a, #0e1015); */
    background: rgba(var(--v-border-color), var(--v-border-opacity));
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow:
        inset 0 3px 8px rgba(0, 0, 0, 0.6),
        inset 0 -2px 4px rgba(255, 255, 255, 0.03),
        0 0 0 2px #1a1d24;
}

.bulb:not(.readonly) {
    cursor: pointer;
}

.bulb {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    flex-shrink: 0;
}

/* Lens shine */
.bulb::after {
    content: '';
    position: absolute;
    top: 5px;
    left: 6px;
    width: 12px;
    height: 8px;
    background: radial-gradient(ellipse, rgba(255, 255, 255, 0.25) 0%, transparent 100%);
    border-radius: 50%;
    transform: rotate(-25deg);
    pointer-events: none;
}
</style>