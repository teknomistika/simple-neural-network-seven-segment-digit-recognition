<template>
    <v-row>
        <v-col :cols="3">
            <v-list lines="one" nav density="compact">
                <v-list-item v-for="n in 3" :key="n" :title="'Item ' + n"
                    subtitle="Lorem ipsum dolor sit amet consectetur adipisicing elit"></v-list-item>
            </v-list>
        </v-col>
        <v-col :cols="9">
            <div class="stage" :style="{ aspectRatio: `${ratio.w} / ${ratio.h}` }">
                <TrainingVector class="vector" style="display: none;" ref="vector" />
            </div>
        </v-col>
    </v-row>

</template>
<style>
.vector {
    path {
        display: none;
    }

    .active path {
        display: initial;
    }
}
</style>
<script setup lang="ts">

import TrainingVector from './TrainingVectorPlain.svg'
import { onMounted, onUnmounted, onUpdated, ref, shallowRef, watch, type ComponentPublicInstance } from 'vue';

// import type { VResponsive } from 'vuetify/components';
// 16 / 9
const ratio = { w: 3, h: 4 }
// const scale = 10
// const dim = { x: ratio.w * scale, y: ratio.h * scale }
const vector = shallowRef<ComponentPublicInstance>()
const layersNames = ['predict', 'residual', 'gradient', 'optimizer'] as const
type LayerNames = (typeof layersNames)[number]

const active = ref<number | null>(null)

const layers: SVGGElement[] = []
const setupVector = () => {
    const svg: SVGSVGElement = vector.value.$el
    layersNames.forEach(name => layers.push(svg.querySelector(`#${name}`) ?? null))
    // Reset
    layers.forEach(l => l.classList.remove('active'))

    svg.setAttribute('width', '100%')
    svg.setAttribute('height', '100%')
    svg.style.display = ''
}
function next() {
    if (active.value === null) {
        active.value = 0
    } else {
        active.value++
        if (active.value >= layersNames.length) {
            active.value = null
        }
    }

}
let timer

watch(active, (current, old) => {
    
    if (current === null)
        layers.forEach(l => l.classList.remove('active'))
    else layers[current].classList.add('active')
})

function setActiveLayer(name: LayerNames) {

}
onUpdated(() => {
    setupVector()
})
onMounted(() => {
    setupVector()
    timer = setInterval(() => {
        next()
    }, 1000)
})
onUnmounted(() => {
    clearInterval(timer)
})

// onUnmounted(() => svg?.remove())

</script>
