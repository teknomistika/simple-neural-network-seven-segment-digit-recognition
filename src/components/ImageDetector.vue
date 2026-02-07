<template>
    <div>
        <canvas ref="canvas"></canvas>
        <img ref="image" @load="analyzeImage" style="display: none;" />
        <SevenSegment :active-segements="activeSegements" />
    </div>
</template>

<script setup lang="ts">
import type { Segment } from '@/types';
import { scanSevenSegmentOnCanvas } from '@/utils/seven-segment.util';
import { onMounted, ref, shallowRef } from 'vue';
import SevenSegment from './SevenSegment.vue';

const props = defineProps<{ src: string }>()
const canvas = shallowRef<HTMLCanvasElement>()
const image = shallowRef<HTMLImageElement>()
const activeSegements = ref<Segment[]>([])

onMounted(() => {
    if (props.src) {
        image.value.src = props.src
    }
})

function analyzeImage() {
    const ctx = canvas.value.getContext('2d');
    const { width, height } = image.value

    // Set canvas dimensions to the image dimensions
    canvas.value.width = width;
    canvas.value.height = height;

    // Draw the image onto the canvas
    ctx.drawImage(image.value, 0, 0, width, height);
    const result = scanSevenSegmentOnCanvas(ctx, width, height)
    activeSegements.value = result.segments
}

</script>