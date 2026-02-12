<template>
    <div ref="drawing">

    </div>
</template>

<script setup lang="ts">
import type { MicroNNModel } from '@/types';
import { onMounted, onUnmounted, shallowRef } from 'vue';
import Konva from 'konva'

const props = defineProps<{ model: MicroNNModel }>()
const drawing = shallowRef<HTMLDivElement>()
let stage: Konva.Stage
let layer: Konva.Layer
const width = 600
const height = 800


onMounted(() => {
    stage = new Konva.Stage({
        container: drawing.value,
        width,
        height,
    })
    layer = new Konva.Layer();
    stage.add(layer)

    const circle = new Konva.Circle({
        x: stage.width() / 2,
        y: stage.height() / 2,
        radius: 50,
        fill: 'green',
    });
    layer.add(circle);
})

onUnmounted(() => {
    stage.remove()
})

</script>