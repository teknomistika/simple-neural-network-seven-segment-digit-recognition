<template>

    <VDialog v-model="dialog" :maxWidth="500">
        <template v-slot:activator="{ props }">
            <slot v-bind="{ props }"></slot>
        </template>
        <VCard title="Add new Sample">
            <VDivider />
            <VCardItem>
                <p>Lights State:</p>
                <TrafficLight with-sliders v-model="lights" />
            </VCardItem>
            <VCardItem>
                <p>Gas Pedal Pressure :</p>
                <SliderValue class="ml-5" v-model="pressure" />
            </VCardItem>
            <VCardActions>
                <!-- <VBtn color="warning" @click="clearCanvas">Clear</VBtn>
               <VBtn color="primary" @click="saveDrawing">Download</VBtn> -->
                <VSpacer />
                <VBtn color="success" @click="onOk" variant="tonal">OK</VBtn>
            </VCardActions>
        </VCard>
    </VDialog>
</template>
<script setup lang="ts">

import { ref, unref } from 'vue';
import TrafficLight from './TrafficLight.vue';
import SliderValue from './SliderValue.vue';
import type { Dataset } from '@/types';

const dialog = ref(false)
const lights = ref([0, 0, 0])
const pressure = ref(0)
const emits = defineEmits<{ dataset: [Dataset] }>()

defineExpose({
    edit(dataset: Dataset) {
        lights.value = unref(dataset.lights)
        pressure.value = unref(dataset.pressure)
        dialog.value = true
    },
    add() {
        lights.value = [0, 0, 0]
        pressure.value = 0
        dialog.value = true
    }
})

function onOk() {
    emits('dataset', { pressure: unref(pressure), lights: unref(lights) })
    dialog.value = false
}

</script>
