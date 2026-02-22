<template>
    <div class="stage" :style="{ aspectRatio: `${ratio.w} / ${ratio.h}` }">
        <svg ref="svgEl" width="100%" height="100%" :viewBox="`0 0 ${dim.x} ${dim.y}`"
            xmlns="http://www.w3.org/2000/svg">
            <!-- <rect width="100%" height="100%" fill="white" stroke="none" /> -->
            <template v-for="(lines, k) in grids" :key="k">
                <line v-for="(p, i) in lines" x1="0" v-bind="p" :key="`${k}${i}`" stroke="#888" stroke-width=".1" />
            </template>

            <!-- <rect x="10" y="10" width="10" height="10" fill="#2563eb" Xstroke="#1d4ed8" Xstroke-width="2" /> -->

            <!-- Number to animate -->
            <!-- <text x="15" y="15" id="movingText" font-size="10" fill="orange" text-anchor="middle"
                dominant-baseline="middle">5</text> -->
        </svg>
        <div class="forward border">
            <div class="box inputs">
                <p>Input (x)</p>
                <div class="x">
                    1
                </div>
                <div class="x">
                    2
                </div>
                <div class="x">
                    3
                </div>
            </div>
        </div>
    </div>
</template>
<style>
.stage {
    display: block;
    position: relative;

    >svg {
        position: absolute;
    }

    .forward {
        /* height: 30%; */
        display: flex;
        background-color: rgba(0, 166, 255, 0.327);
    }
}


.stage .box {
    text-align: center;
    gap: 2px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
}

.stage .box.inputs {
    margin-left: 5%;
    width: 5%;
    >.x {
        border: solid 1px red;
        background-color: red;
        aspect-ratio: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
</style>
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
