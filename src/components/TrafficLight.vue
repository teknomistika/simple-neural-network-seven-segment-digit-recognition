<template>
    <VSheet class="pa-2">
        <!-- RED -->
        <div v-for="(v, i) in values" :key="i" class="d-flex ga-2 justify-center">
            <div class="light-socket py-1">
                <div class="bezel" @click="values[i] = values[i] ? 0 : 1">
                    <div class="bulb" :style="getStyle(v, i)">
                        <!-- <code>{{ v.toFixed(1) }}</code> -->
                    </div>
                </div>
            </div>
            <div class="light-slider d-flex align-center">
                <SliderValue v-if="withSliders" :color="v > 0 ? lightColors[i] : 'grey'" hide-details :min="0" :max="1"
                    :step="0.1" v-model="values[i]" />
                <VChip v-else :color="v > 0 ? lightColors[i] : 'grey'" :value="true" label>
                    <code>{{ v.toFixed(1) }}</code>
                </VChip>
            </div>
        </div>
    </VSheet>

</template>
<script lang="ts">
const lightNames = ['Red', 'Yellow', 'Green']
const lightColors = [/* red */ '#ff3232',/* yellow */ '#ffc800',/* green */ '#00dc50']
const lightGlows = [ /* red */[255, 50, 50], /* yellow */[255, 200, 0], /* green */[0, 220, 80]]
const offMap = [
  /* red */   'radial-gradient(circle at 40% 35%, #3d1a1a, #200d0d)',
  /* yellow */'radial-gradient(circle at 40% 35%, #2e2510, #180f05)',
  /* green */ 'radial-gradient(circle at 40% 35%, #0e2a18, #061208)',
]
function getStyle(brightness: number, colorIndex: number) {
    if (!brightness || brightness <= 0.09) {
        return {
            background: offMap[colorIndex],
            boxShadow: 'inset 0 3px 10px rgba(0,0,0,0.5)',
        }
    }

    const [r, g, bl] = lightGlows[colorIndex];
    const glowRadius = Math.round(5 + brightness * 5);
    const spread = Math.round(brightness);

    return {
        background: `radial-gradient(circle at 40% 35%,
          rgba(${r},${g},${bl}, ${0.4 + brightness * 0.6}) 0%,
          rgba(${Math.round(r * 0.7)},${Math.round(g * 0.7)},${Math.round(bl * 0.7)}, ${0.8 + brightness * 0.2}) 60%,
          rgba(${Math.round(r * 0.3)},${Math.round(g * 0.3)},${Math.round(bl * 0.3)}, 1) 100%
        )`,
        boxShadow: `
          inset 0 3px 10px rgba(0,0,0,0.3),
          0 0 ${glowRadius}px ${spread}px rgba(${r},${g},${bl}, ${brightness * 0.9}),
          0 0 ${Math.round(glowRadius * 2)}px rgba(${r},${g},${bl}, ${brightness * 0.4})
        `,
        filter: `brightness(${0.3 + brightness * 0.7})`,
    };
}
</script>
<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import SliderValue from './SliderValue.vue';
const model = defineModel<number[]>({
    default: [0, 0, 1]
})
defineProps<{ withSliders?: boolean }>()

const values = ref(Array(3).fill(0).map((_, i) => model.value[i] ?? 0))
// const styles = ref(Array(3).fill(0).map((_, i) => getStyle(values.value[i], i)))
watch(values, (changes) => {
    // changes.forEach((v, i) => {
    //     styles[i] = getStyle(v, i)
    // })
    model.value = changes
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

.bulb {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    cursor: pointer;
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