<template>
    <div class="d-flex">
        <div style="width:160px;">
            <div ref="trainMenu">
                <v-list-item title="Stepper"></v-list-item>
                <v-list-item v-for="(t, i) in Steps" @click="selectStep(i)"
                    :disabled="i !== 0 && current === null || current + 1 < i" :title="t" :active="current === i"
                    color="primary">
                    <template #prepend>
                        <v-avatar>{{ i + 1 }}</v-avatar>
                    </template>
                </v-list-item>
                <v-list-item @click="stepDone" :disabled="current + 1 < Steps.length" title="Done">
                    <template #prepend>
                        <v-avatar>{{ Steps.length + 1 }}</v-avatar>
                    </template>
                </v-list-item>
                <v-divider />
                <div class="pa-3 d-flex justify-center">
                    <VCheckbox v-model="autoscroll" density="compact" hide-details label="Auto-scroll" />
                </div>
            </div>
        </div>
        <div :cols="9" style="flex: 1;">
            <TrainingVector class="vector" ref="vector" :style="{ aspectRatio: `${ratio.w} / ${ratio.h}` }" />
        </div>
    </div>

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
import TrainingVector from './TrainingVectorPlain.svg'
import { onMounted, onUnmounted, onUpdated, ref, shallowRef, watch, type ComponentPublicInstance } from 'vue';
import { useGoTo } from 'vuetify'

// import type { VResponsive } from 'vuetify/components';
// 16 / 9
const ratio = { w: 3, h: 4 }
// const scale = 10
// const dim = { x: ratio.w * scale, y: ratio.h * scale }
const vector = shallowRef<ComponentPublicInstance>()
const trainMenu = shallowRef<HTMLDivElement>()
const layersNames = ['predict', 'residual', 'gradient', 'optimizer'] as const
const Steps = ['Predict', 'Residual', 'Gradients', 'Optimizer']

type LayerNames = (typeof layersNames)[number]

const sticky = useSticky(trainMenu)

const autoscroll = ref(true)
const current = ref<number | null>(null)

const layers: SVGGElement[] = []
const setupVector = () => {
    const svg: SVGSVGElement = vector.value.$el
    layersNames.forEach(name => layers.push(svg.querySelector(`#${name}`) ?? null))
    // Reset
    // layers.forEach(l => l.classList.remove('active'))
    // svg.querySelectorAll('path').forEach(v => {
    //     v.removeAttribute('style')
    // })
    // svg.setAttribute('width', '100%')
    // svg.setAttribute('height', '100%')
    // svg.style.display = 'block'
}

function stepDone() {
    current.value = null
    if (autoscroll.value) {
        layers[0].scrollIntoView({
            behavior: 'smooth',
            block: 'end'
        })
    }
}

// const goTo = useGoTo()

function selectStep(i: number) {
    if (current !== null && i < current.value) {
        return
    }

    current.value = i
    if (autoscroll.value) {
        layers[i].scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        })
    }
}
function next() {
    if (current.value === null) {
        current.value = 0
    } else {
        current.value++
        if (current.value >= layersNames.length) {
            current.value = null
        }
    }

}
let timer

watch(current, (current, old) => {
    console.log('ACTIVE CHANGED', current, old)
    if (current === null)
        layers.forEach(l => l.classList.remove('active'))
    else {
        layers.slice(0, current + 1).forEach(v => v.classList.add('active'))
    }
})

onUpdated(() => {
    setupVector()
})
onMounted(() => {

    setupVector()
    // next()
    // timer = setInterval(() => {
    //     next()
    // }, 1000)
})
onUnmounted(() => {
    sticky.stop()
    clearInterval(timer)
})

// onUnmounted(() => svg?.remove())

</script>
