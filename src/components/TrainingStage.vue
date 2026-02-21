<template>
    <div class="d-flex" :style="{ aspectRatio: `${ratio.w} / ${ratio.h}` }">
        <svg ref="svgEl" width="100%" height="100%" :viewBox="`0 0 ${dim.x} ${dim.y}`"
            xmlns="http://www.w3.org/2000/svg">
            <!-- <rect width="100%" height="100%" fill="white" stroke="none" /> -->
            <template v-for="(lines, k) in grids" :key="k">
                <line v-for="(p, i) in lines" x1="0" v-bind="p" :key="`${k}${i}`" stroke="#888" stroke-width=".1" />
            </template>

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

import { SVG } from '@svgdotjs/svg.js'
import { onMounted, onUnmounted, ref, shallowRef, watch } from 'vue';

// import type { VResponsive } from 'vuetify/components';
// 16 / 9
const ratio = { w: 16, h: 9 }
const scale = 10
const dim = { x: ratio.w * scale, y: ratio.h * scale }
const svgEl = shallowRef<SVGAElement>()
let svg: ReturnType<typeof SVG<SVGAElement>>

const grids = [
    // Horizontal
    Array.from({ length: ratio.h - 1 }, (_, i) => ({
        x1: 0,
        y1: (1 + i) * scale,
        x2: dim.x,
        y2: (1 + i) * scale,
    })),
    // Vertical
    Array.from({ length: ratio.w - 1 }, (_, i) => ({
        x1: (1 + i) * scale,
        y1: 0,
        x2: (1 + i) * scale,
        y2: dim.y,
    })),
]


onMounted(() => {
    svg = SVG(svgEl.value)
    // const rect = svg.rect(10, 10)
    // rect.animate({
    //     duration: 2000,
    //     delay: 1000,
    //     when: 'now',
    //     swing: true,
    //     times: 5,
    //     wait: 200
    // }).attr({ fill: '#f03' })
    // console.log(`Stage: ${stage.value.clientWidth}x${stage.value.clientHeight}`)
    // console.log(arrow.value)
    // arrow.value?.to({
    //     stroke: 'orange',
    //     strokeWidth: 4,
    //     duration: 0.5,
    //     yoyo: true,
    //     repeat: 1
    // })
})

onUnmounted(() => svg?.remove())

</script>
<style>
/* .stage {
    aspect-ratio: 1.7777777777777777;
} */
</style>