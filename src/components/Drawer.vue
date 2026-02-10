<template>
    <div class="drawer">
        <VRow>
            <VCol class="text-center">
                <p>Draw seven-segment digit here:</p>
                <canvas ref="drawCanvas" width="90" height="160"></canvas>
            </VCol>
            <VCol class="text-center">
                <p>Detected segments:</p>
                <SevenSegment :active-segements="result?.segments" />
            </VCol>
        </VRow>
        <VSheet class="pa-3" color="primary">
        </VSheet>
        <div>
            <VBtn density="comfortable" variant="text" color="warning" @click="clearCanvas">Clear</VBtn>
            <VBtn density="comfortable" variant="text" color="primary" @click="saveDrawing">Download</VBtn>
        </div>
        <pre ref="stats" class="stats"></pre>
        <a style="display: none;" ref="link"></a>
    </div>
</template>
<script setup lang="ts">
import type { Segment, SegmentScanResult } from '@/types';
import { scanSevenSegmentOnCanvas } from '@/utils/seven-segment.util';
import { onBeforeUnmount, onMounted, shallowRef, type ShallowRef } from 'vue';
import SevenSegment from './SevenSegment.vue';

const drawCanvas = shallowRef<HTMLCanvasElement>()
const link = shallowRef<HTMLAnchorElement>()
const stats = shallowRef<HTMLDivElement>()
const result = shallowRef<SegmentScanResult>(null)

const emits = defineEmits<{
    segments: [Segment[]]
}>()

let ctx: CanvasRenderingContext2D
// Drawing state
let isDrawing = false;
let lastX = 0;
let lastY = 0;

function startDrawing(e) {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
}

function clearCanvas() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, drawCanvas.value.width, drawCanvas.value.height);
    emits('segments', [])
    stats.value.innerHTML = ''
    // updatePreview();
}

function scanDigit() {
    result.value = scanSevenSegmentOnCanvas(ctx, drawCanvas.value.width, drawCanvas.value.height)
    const { detected, segments, confidence } = result.value
    stats.value.innerHTML = `Detected: ${detected} (${confidence}%)<br/>Segments: ${segments}`
    emits('segments', segments)
}

function draw(e) {
    if (!isDrawing) return;

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();

    [lastX, lastY] = [e.offsetX, e.offsetY];

    // Update preview in real-time
    // updatePreview();
}
function handleTouch(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = drawCanvas.value.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    if (e.type === 'touchstart') {
        isDrawing = true;
        [lastX, lastY] = [x, y];
    } else if (e.type === 'touchmove' && isDrawing) {
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.stroke();
        [lastX, lastY] = [x, y];
        // updatePreview();
    }
}
function stopDrawing() {
    isDrawing = false;
    scanDigit()
}

function saveDrawing() {
    link.value.download = `digit_${Date.now()}.png`;
    link.value.href = drawCanvas.value.toDataURL('image/png');
    setTimeout(() => {
        link.value.click();
    }, 0)
}
onMounted(() => {
    // Main drawing canvas setup
    const canvas = drawCanvas.value!
    ctx = canvas.getContext('2d', { willReadFrequently: true });
    // const miniCanvas = document.getElementById('miniCanvas');
    // const miniCtx = miniCanvas.getContext('2d');



    // Configure drawing style
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 20;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Clear canvas initially
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Mouse events
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    // Touch events for mobile
    canvas.addEventListener('touchstart', handleTouch);
    canvas.addEventListener('touchmove', handleTouch);
    canvas.addEventListener('touchend', stopDrawing);
})

onBeforeUnmount(() => {

    const canvas = drawCanvas.value!
    if (!canvas) return
    // Mouse events
    canvas.removeEventListener('mousedown', startDrawing);
    canvas.removeEventListener('mousemove', draw);
    canvas.removeEventListener('mouseup', stopDrawing);
    canvas.removeEventListener('mouseout', stopDrawing);

    // Touch events for mobile
    canvas.removeEventListener('touchstart', handleTouch);
    canvas.removeEventListener('touchmove', handleTouch);
    canvas.removeEventListener('touchend', stopDrawing);
})

</script>
<style>
.drawer canvas {
    border: 2px dashed #ccc;
    cursor: crosshair;
    background: white;
    touch-action: none;
}
</style>