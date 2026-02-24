<template>
    <v-row>
        <v-col :cols="4">
            <div ref="trainMenu" style="background-color: rgb(var(--v-theme-surface));">
                <v-list-item title="Stepper"></v-list-item>
                <v-list-item v-for="(t, i) in steps" @click="selectStep(i)" density="compact"
                    :disabled="i !== 0 && current === null || current + 1 < i" :title="t" :active="current === i"
                    color="primary">
                    <template #prepend>
                        <v-avatar class="hidden-sm-and-down">{{ i + 1 }}</v-avatar>
                    </template>
                </v-list-item>
                <v-list-item density="comfortable" @click="stepDone" :disabled="current + 1 < steps.length"
                    title="Done">
                    <template #prepend>
                        <v-avatar class="hidden-sm-and-down">{{ steps.length + 1 }}</v-avatar>
                    </template>
                </v-list-item>
                <v-divider />
                <div class="pa-3 d-flex justify-center">
                    <VCheckbox v-model="autoscroll" density="compact" hide-details label="Auto-scroll" />
                </div>
            </div>
        </v-col>
        <v-col :cols="8" class="text-center">
            <TrainingVector class="vector" ref="vector"
                :style="{ aspectRatio: `${ratio.w} / ${ratio.h}`, maxHeight: '900px', margin: 'auto' }" />
            <TrainingStats class="mt-3" />
        </v-col>
    </v-row>

</template>
<style>
.vector {
    g path {
        opacity: 0.3;
        transition-duration: 300ms;
        stroke-dasharray: 5;
        stroke-dashoffset: 0;
        animation: none;
    }

    g.active path {
        animation: dash 1s linear infinite;
        opacity: 1;
    }
}

@keyframes dash {
    from {
        stroke-dashoffset: 10;
    }

    to {
        stroke-dashoffset: 0;
    }
}
</style>

<script setup lang="ts">
import { useSticky } from '@/composables/useSticky';
import TrainingVector from './TrainingVector.svg'
import { onMounted, onUnmounted, onUpdated, reactive, ref, shallowRef, watch, type ComponentPublicInstance } from 'vue';
import ModelStats from './ModelStats.vue';
import { useModel } from '@/composables/useModel';
import type { MicroNNModel } from '@/types';

const ratio = { w: 3, h: 4 }
const vector = shallowRef<ComponentPublicInstance>()
const trainMenu = shallowRef<HTMLDivElement>()

const steps = ['Predict', 'Residual', 'Gradients', 'Optimizer']
const layers = ['predict', 'residual', 'gradient', 'optimizer']

/** Known all ID value in SVG */
const vectorRefs = {
    x1: null as SVGTextElement,
    x2: null as SVGTextElement,
    x3: null as SVGTextElement,
    b: null as SVGTextElement,
    w1: null as SVGTextElement,
    w2: null as SVGTextElement,
    w3: null as SVGTextElement,
    lr: null as SVGTextElement,
    o_b: null as SVGTextElement,
    o_w1: null as SVGTextElement,
    o_w2: null as SVGTextElement,
    o_w3: null as SVGTextElement,
    g_b: null as SVGTextElement,
    g_w1: null as SVGTextElement,
    g_w2: null as SVGTextElement,
    g_w3: null as SVGTextElement,
    error: null as SVGTextElement,
    output1: null as SVGTextElement,
    output2: null as SVGTextElement,
    target: null as SVGTextElement,
    // Layers
    gradient: null as SVGGElement,
    optimizer: null as SVGGElement,
    predict: null as SVGGElement,
    residual: null as SVGGElement,

    output_fill: null as SVGRectElement,
    residual_fill: null as SVGRectElement,
    target_fill: null as SVGRectElement,
}
type VectorText<T> = {
    [K in keyof T]: T[K] extends SVGTextElement ? K : never;
}[keyof T];

const sticky = useSticky(trainMenu)
const autoscroll = ref(true)
const current = ref<number | null>(null)

const predictState = reactive({
    inputs: [NaN, NaN, NaN],
    output: NaN,
    target: NaN
})

const { model } = useModel()

function setValue(k: VectorText<typeof vectorRefs>, v: number) {
    if (isNaN(v) || v === null) {
        vectorRefs[k].textContent = ''
    } else {
        vectorRefs[k].textContent = v.toFixed(2)
    }
}

function onModelChange(m: MicroNNModel) {
    setValue('w1', m.weights[0])
    setValue('w2', m.weights[1])
    setValue('w3', m.weights[2])
    setValue('b', m.bias)
}

function onPredictChange() {
    setValue('x1', predictState.inputs[0])
    setValue('x2', predictState.inputs[1])
    setValue('x3', predictState.inputs[2])
    setValue('output1', predictState.output)
    setValue('output2', predictState.output)
    setValue('target', predictState.target)
    setBarMeter(predictState.output, 'output_fill')
    setBarMeter(predictState.target, 'target_fill')
}

function setBarMeter(v: number, k: 'output_fill' | 'target_fill') {
    const el = vectorRefs[k]
    if (isNaN(v)) {
        el.style.opacity = '0'
        return
    }
    // Make the value always between -1 to +1
    const value = Math.min(1, Math.max(-1, v))
    // width : 60, height: 200, x: 420, y: 80;
    const height = 200 / 2 * (value + 1)
    el.setAttribute('y', (80 + 200 - height).toFixed())
    el.setAttribute('height', height.toFixed())
    el.style.opacity = ''
    el.style.fill = `hsl(${height / 2}, 100%, 32%)`;
}

watch(model, onModelChange)
watch(predictState, onPredictChange)
const r = () => parseFloat((Math.random() * 2 - 1).toFixed(2))
const setupVector = () => {
    const svg: SVGSVGElement = vector.value.$el
    for (const id in vectorRefs) {
        if (!(vectorRefs[id] = svg.querySelector('#' + id))) {
            console.warn(`Missing element in SVG Vector: ${id}`)
        }
    }
    // Dummy data
    predictState.inputs = Array.from({ length: 3 }, r)
    predictState.output = r()
    predictState.target = r()
    reset()
}

function reset() {
    current.value = null
    onModelChange(model)
    onPredictChange()
}

function stepDone() {
    reset()
    // if (autoscroll.value) {
    //     vectorRefs.predict.scrollIntoView({
    //         behavior: 'smooth',
    //         block: 'end'
    //     })
    // }
}

function selectStep(i: number) {
    if (current !== null && i < current.value) {
        return
    }

    current.value = i
    if (autoscroll.value) {
        vectorRefs[layers[i]].scrollIntoView({
            behavior: 'smooth',
            block: 'end'
        })
    }
}
function next() {
    if (current.value === null) {
        current.value = 0
    } else {
        current.value++
        if (current.value >= layers.length) {
            current.value = null
        }
    }

}

watch(current, (current, old) => {
    if (current === null)
        layers.forEach(v => vectorRefs[v].classList.remove('active'))
    else {
        layers.slice(0, current + 1).forEach(v => vectorRefs[v].classList.add('active'))
    }
})

onUpdated(() => {
    setupVector()
})
onMounted(() => {
    setupVector()
})
onUnmounted(() => {
    sticky.stop()
})

// onUnmounted(() => svg?.remove())

</script>
