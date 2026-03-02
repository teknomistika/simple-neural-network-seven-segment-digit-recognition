<template>
    <InferenceVectorSvg class="vector" ref="vector" style="max-width: 100%; height: auto; " />
</template>

<script setup lang="ts">
import { useModel } from '@/composables/useModel';
import { onMounted, onUpdated, shallowRef, watchEffect, type GlobalComponents } from 'vue';

const vector = shallowRef<GlobalComponents['InferenceVectorSvg']>()
const props = defineProps<{ inputs: number[], output: number }>()
const { model } = useModel()
/** Known all ID value in SVG */
const vectorRefs = {
    x1: null as SVGTextElement,
    x1_bg: null as SVGCircleElement,
    x1_line: null as SVGPathElement,
    x2: null as SVGTextElement,
    x2_bg: null as SVGCircleElement,
    x2_line: null as SVGPathElement,
    x3: null as SVGTextElement,
    x3_bg: null as SVGCircleElement,
    x3_line: null as SVGPathElement,
    b: null as SVGTextElement,
    w1: null as SVGTextElement,
    w2: null as SVGTextElement,
    w3: null as SVGTextElement,
    output1: null as SVGTextElement,
    layer: null as SVGGElement,
}

type VectorText<T> = {
    [K in keyof T]: T[K] extends SVGTextElement ? K : never;
}[keyof T];

function setValues(ks: VectorText<typeof vectorRefs>[], vs: number[]) {
    ks.forEach((k, i) => setValue(k, vs[i]))
}

function setValue(k: VectorText<typeof vectorRefs>, v: number) {
    if (!vectorRefs[k])
        return console.debug('VectorRefs not ready')

    if (isNaN(v) || v === null) {
        vectorRefs[k].textContent = ''
    } else {
        vectorRefs[k].textContent = v.toFixed(2)
    }
}

const updates = () => {
    setValues(['x1', 'x2', 'x3'], props.inputs)
    setValue('output1', props.output)
    let op = '0'
    if (!vectorRefs['x1_bg']) return // not ready
    props.inputs.forEach((v, i) => {
        op = (0.2 + 0.8 * v).toFixed(4)
        vectorRefs[`x${i + 1}_bg`].style.opacity = op
        vectorRefs[`x${i + 1}_line`].style.opacity = op
    })
}

const setupVector = () => {
    const svg: SVGSVGElement = vector.value.$el
    for (const id in vectorRefs) {
        if (!(vectorRefs[id] = svg.querySelector('#' + id))) {
            console.warn(`Missing element in SVG Vector: ${id}`)
        }
    }
    vectorRefs.layer.classList.add('active')
    setValues(['w1', 'w2', 'w3', 'b'], [...model.weights, model.bias])
    updates()
}

onUpdated(setupVector)
onMounted(setupVector)
watchEffect(updates)
</script>
