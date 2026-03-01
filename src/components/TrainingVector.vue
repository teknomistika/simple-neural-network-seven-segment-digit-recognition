<template>
    <TrainingVectorSvg class="vector" ref="vector"
        :style="{ aspectRatio: `${ratio.w} / ${ratio.h}`, maxHeight: '900px', margin: 'auto' }" />
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

    g:not(#inputs) circle {
        opacity: 0.1;
    }

    g.active path {
        animation: dash 1s linear infinite;
        opacity: 1;
    }

    g.active:not(#inputs) circle {
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
import { onMounted, onUpdated, shallowRef, watch, type GlobalComponents, type Ref } from 'vue';
import type { MicroNNModel } from '@/types';
import { useModel } from '@/composables/useModel';
import { useGlowController } from '@/composables/useGlowController';

const ratio = { w: 3, h: 4 }
const vector = shallowRef<GlobalComponents['TrainingVectorSvg']>()
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

    error_line: null as SVGPathElement,

    x1_glow: null as SVGCircleElement,
    x2_glow: null as SVGCircleElement,
    x3_glow: null as SVGCircleElement,
}

type VectorText<T> = {
    [K in keyof T]: T[K] extends SVGTextElement ? K : never;
}[keyof T];

const { model } = useModel()

function step1(inputs: number[], target: number, output: number, setActive = true) {
    setValues(['x1', 'x2', 'x3'], inputs)
    setValues(['output1', 'output2', 'target'], [output, output, target])
    setBarFill(output, 'output_fill')
    setBarFill(target, 'target_fill')
    if (!inputs || isNaN(inputs[0])) {
        bulbs.forEach(b => b.value = 0)
    } else {
        bulbs.forEach((b, i) => b.value = inputs[i])
    }
    setActive && setActiveLayer(0)
}

function step2(output: number, target: number, setActive = true) {
    setResidual(output, target)
    setActive && setActiveLayer(1)
}

function step3(values: number[], setActive = true) {
    setValues(['g_w1', 'g_w2', 'g_w3', 'g_b'], values)
    setActive && setActiveLayer(2)
}

function step4(values: number[], setActive = true) {
    setValues(['o_w1', 'o_w2', 'o_w3', 'o_b'], values)
    setActive && setActiveLayer(3)
}

function stepDone() {
    step1([NaN, NaN, NaN], NaN, NaN, false)
    step2(NaN, NaN, false)
    step3([NaN, NaN, NaN, NaN], false)
    step4([NaN, NaN, NaN, NaN], false)
    setActiveLayer(null)
}

function scrollToStep(i: number | null) {
    if (i === null) {
        document.querySelector('main > .v-container').scrollTo({
            behavior: 'smooth',
            top: 0
        })
        return
    }
    vectorRefs[layers[i]].scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    })
}

defineExpose({ step1, step2, step3, step4, stepDone, scrollToStep })

function setValues(ks: VectorText<typeof vectorRefs>[], vs: number[]) {
    ks.forEach((k, i) => setValue(k, vs[i]))
}

function setValue(k: VectorText<typeof vectorRefs>, v: number) {
    if (isNaN(v) || v === null) {
        vectorRefs[k].textContent = ''
    } else {
        vectorRefs[k].textContent = v.toFixed(2)
    }
}
function onModelUpdate(m: MicroNNModel) {
    setValue('w1', m.weights[0])
    setValue('w2', m.weights[1])
    setValue('w3', m.weights[2])
    setValue('b', m.bias)
    setValue('lr', m.learningRate)
}
watch(model, onModelUpdate)

function setBarFill(v: number, k: 'output_fill' | 'target_fill') {
    const el = vectorRefs[k]
    if (isNaN(v)) {
        return el.style.opacity = '0'
    }
    // Make the value always between -1 to +1
    const value = Math.min(1, Math.max(-1, v))
    // width : 60, height: 200, x: 420, y: 80;
    const height = 200 / 2 * (value + 1)
    el.setAttribute('y', (80 + 200 - height).toFixed())
    el.setAttribute('height', height.toFixed())
    el.style.fill = `hsl(${height / 2}, 100%, 32%)`;
    el.style.opacity = ''
}

function setResidual(output: number, target: number) {

    const el = vectorRefs['residual_fill']
    if (isNaN(output) || isNaN(target)) {
        setValue('error', NaN)
        return el.style.opacity = '0'
    }
    const residual = output - target
    // width : 60, height: 200, x: 420, y: 80;
    setValue('error', residual)
    let outputY = vectorRefs['output_fill'].y.baseVal.value
    let targetY = vectorRefs['target_fill'].y.baseVal.value
    el.setAttribute('y', Math.min(outputY, targetY).toString())
    el.setAttribute('height', Math.abs(outputY - targetY).toString())
    el.style.fill = `hsl(${residual / 2}, 100%, 32%)`;
    el.style.opacity = ''

    let d = vectorRefs['error_line'].getAttribute('d')
    const lower = Math.max(outputY, targetY).toString()
    vectorRefs['error_line'].setAttribute('d', d.replace(/^(M \d+),\d+/, `$1,${lower}`))
}

const bulbs: Ref<number>[] = []
const setupVector = () => {
    const svg: SVGSVGElement = vector.value.$el
    for (const id in vectorRefs) {
        if (!(vectorRefs[id] = svg.querySelector('#' + id))) {
            console.warn(`Missing element in SVG Vector: ${id}`)
        }
    }
    bulbs.push(
        useGlowController(0, vectorRefs.x1_glow, 0),
        useGlowController(1, vectorRefs.x2_glow, 0.5),
        useGlowController(2, vectorRefs.x3_glow, 1)
    )

    onModelUpdate(model)
}

function setActiveLayer(current) {
    if (current === null)
        layers.forEach(v => vectorRefs[v].classList.remove('active'))
    else {
        layers.slice(0, current + 1).forEach(v => vectorRefs[v].classList.add('active'))
    }
}

onUpdated(() => {
    setupVector()
})
onMounted(() => {
    setupVector()
})
</script>
