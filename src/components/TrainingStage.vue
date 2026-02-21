<template>
    <div ref="stage" class="stage" :style="{ aspectRatio: ratio.w / ratio.h }">
        <svg width="100%" height="100%" :viewBox="`0 0 ${dim.x} ${dim.y}`" xmlns="http://www.w3.org/2000/svg">
            <!-- <rect width="100%" height="100%" fill="white" stroke="none" /> -->
            <!-- Horizontal lines -->
            <line v-for="i in ratio.h - 1" x1="0" :y1="i * scale" :x2="dim.x" :y2="i * scale" stroke="#ccc"
                stroke-width="0.1" />
            <!-- Vertical lines -->
            <line v-for="i in ratio.w - 1" :x1="i * scale" y1="0" :x2="i * scale" :y2="dim.y" stroke="#ccc"
                stroke-width="0.1" />

            <!-- Number to animate -->
            <text x="10" y="10" id="movingText" font-size="10" fill="orange">5</text>
        </svg>
        <!-- <v-row>
            <v-col>
                <v-sheet>

                </v-sheet>
            </v-col>
        </v-row> -->
    </div>
</template>

<script setup lang="ts">

import { useSizeWatcher } from '@/composables/useSizeWatcher';
import { onMounted, ref, shallowRef, watch } from 'vue';
import type { VResponsive } from 'vuetify/components';
// 16 / 9
const ratio = { w: 16, h: 9 }
const scale = 10
const dim = { x: ratio.w * scale, y: ratio.h * scale }
const stage = shallowRef<HTMLDivElement>()
// const size = useSizeWatcher(stage, ratio.w/ratio.h)

// const props = withDefaults(
//     defineProps<{
//         weights?: number[],
//         bias?: number
//     }>(), {
//     weights: () => [0.1, -0.2, 0.3],
//     bias: 0.3
// })

// watch(size, (s) => {
//     console.log('SC', s)
// })

onMounted(() => {
    console.log(`Stage: ${stage.value.clientWidth}x${stage.value.clientHeight}`)
    // console.log(arrow.value)
    // arrow.value?.to({
    //     stroke: 'orange',
    //     strokeWidth: 4,
    //     duration: 0.5,
    //     yoyo: true,
    //     repeat: 1
    // })
})

</script>
<style>
/* .stage {
    aspect-ratio: 1.7777777777777777;
} */
</style>