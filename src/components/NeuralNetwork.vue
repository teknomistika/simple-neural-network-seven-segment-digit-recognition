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
// --- Layout config ---
const width = 900
const height = 500
const inputCount = 7
const outputCount = 10

const inputX = 150
const outputX = 750

const inputSpacing = 50
const outputSpacing = 40

const centerY = height / 2
// --- Sample values (can be real model data) ---
const inputs = [1, 1, 1, 1, 0, 1, 1] // digit 9
const weights = Array.from({ length: outputCount }, () =>
    Array.from({ length: inputCount }, () =>
        Math.random() * 2 - 1
    )
)
const biases = Array.from({ length: outputCount }, () =>
    Math.random() * 2 - 1
)
function draw() {
    // --- Draw input neurons ---
    const inputNodes: Konva.Circle[] = []

    for (let i = 0; i < inputCount; i++) {
        const y = centerY - (inputCount - 1) * inputSpacing / 2 + i * inputSpacing

        const circle = new Konva.Circle({
            x: inputX,
            y,
            radius: 14,
            fill: inputs[i] ? "#4ade80" : "#e5e7eb",
            stroke: "#111",
            strokeWidth: 1
        })

        const label = new Konva.Text({
            x: inputX - 60,
            y: y - 8,
            text: `x${i}`,
            fontSize: 14
        })

        inputNodes.push(circle)
        layer.add(circle, label)
    }

    // --- Draw output neurons ---
    const outputNodes: Konva.Circle[] = []

    for (let i = 0; i < outputCount; i++) {
        const y = centerY - (outputCount - 1) * outputSpacing / 2 + i * outputSpacing

        const circle = new Konva.Circle({
            x: outputX,
            y,
            radius: 16,
            fill: "#93c5fd",
            stroke: "#111",
            strokeWidth: 1
        })

        const label = new Konva.Text({
            x: outputX + 30,
            y: y - 8,
            text: `y${i}`,
            fontSize: 14
        })

        const biasLabel = new Konva.Text({
            x: outputX + 30,
            y: y + 10,
            text: `b=${biases[i].toFixed(2)}`,
            fontSize: 11,
            fill: "#555"
        })

        outputNodes.push(circle)
        layer.add(circle, label, biasLabel)
    }

    // --- Draw weights (connections) ---
    for (let i = 0; i < outputCount; i++) {
        for (let j = 0; j < inputCount; j++) {
            const weight = weights[i][j]

            layer.add(new Konva.Line({
                points: [
                    inputNodes[j].x(),
                    inputNodes[j].y(),
                    outputNodes[i].x(),
                    outputNodes[i].y()
                ],
                stroke: weight > 0 ? "#22c55e" : "#ef4444",
                strokeWidth: Math.abs(weight) * 1.5,
                opacity: 0.5
            }))
        }
    }

    layer.draw()
}

onMounted(() => {
    stage = new Konva.Stage({
        container: drawing.value,
        width,
        height,
    })
    layer = new Konva.Layer();
    stage.add(layer)
    draw()
})

onUnmounted(() => {
    stage.remove()
})

</script>