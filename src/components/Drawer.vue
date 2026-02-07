<template>
    <div class="drawer">

        <div class="canvas-container">
            <canvas ref="drawCanvas" width="90" height="160"></canvas>
        </div>
        <div class="controls">
            <button class="clear-btn" @click="clearCanvas">Clear</button>
            <button class="save-btn" @click="saveDrawing">Download</button>
        </div>
        <div ref="stats" class="stats"></div>
        <a style="display: none;" ref="link"></a>
    </div>
</template>
<script setup lang="ts">
import type { Segment } from '@/types';
import { scanSevenSegmentOnCanvas } from '@/utils/seven-segment.util';
import { onBeforeUnmount, onMounted, shallowRef } from 'vue';

const drawCanvas = shallowRef<HTMLCanvasElement>()
const link = shallowRef<HTMLAnchorElement>()
const stats = shallowRef<HTMLDivElement>()

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
    const result = scanSevenSegmentOnCanvas(ctx, drawCanvas.value.width, drawCanvas.value.height)
    console.log(result)
    stats.value.innerHTML = `Detected: ${result.detected} (${result.confidence}%)<br/>Segments: ${result.segments}`
    emits('segments', result.segments)
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
.drawer {
    background: white;
    border-radius: 20px;
    padding: 20px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    max-width: 200px;
    width: 100%;
}

.drawer .canvas-container {
    background: #f8f9fa;
    border-radius: 15px;
    padding: 20px;
    margin-bottom: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.drawer canvas {
    border: 2px dashed #ccc;
    cursor: crosshair;
    background: white;
    touch-action: none;
}

.drawer .controls {
    display: flex;
    gap: 4px;
}

.drawer .stats {
    margin-top: 12px;
    font-size: 12px;
    font-family: 'Courier New', Courier, monospace;
}

.drawer .controls button {
    flex: 1;
    padding: 10px;
    border: none;
    border-radius: 10px;
    /* font-size: 16px; */
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}
</style>