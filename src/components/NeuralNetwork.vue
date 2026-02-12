<template>
    <div ref="drawing">

    </div>
</template>

<script setup lang="ts">
import type { MicroNNModel } from '@/types';
import { onMounted, onUnmounted, shallowRef } from 'vue';
import { Svg, SVG } from '@svgdotjs/svg.js'

const props = defineProps<{ model: MicroNNModel }>()
const drawing = shallowRef<HTMLDivElement>()
let draw: Svg

onMounted(() => {
    draw = SVG().addTo(drawing.value)
    // draw pink square
    draw.rect(100, 100).move(100, 50).fill('#f06')
})

onUnmounted(() => {
    draw.remove()
})

</script>