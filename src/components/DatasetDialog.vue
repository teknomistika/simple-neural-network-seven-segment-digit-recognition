<template>

    <VDialog v-model="dialog" :maxWidth="500" :persistent="mode == 'add'">
        <template v-slot:activator="{ props }">
            <slot v-bind="{ props }"></slot>
        </template>
        <VCard>
            <template #title>
                <VBtn class="float-right" variant="plain" color="error" density="compact" @click="dialog = false" icon="mdi-close"/>
                Add new Sample
            </template>
            <VDivider />
            <VCardItem>
                <p>Lights State:</p>
                <TrafficLight with-sliders v-model="dataset.lights" />
            </VCardItem>
            <VCardItem>
                <p>Gas Pedal Pressure :</p>
                <SliderValue class="ml-5" v-model="dataset.pressure" />
            </VCardItem>
            <VCardActions>
                <VBtn color="warning" @click="setAll(0)">Zero</VBtn>
                <VBtn color="primary" @click="setAll(null)">Random</VBtn>
                <VSpacer />
                <VBtn color="error" v-if="mode == 'add'" @click="dialog = false" variant="tonal">cancel</VBtn>
                <VBtn color="success" v-if="mode == 'add'" @click="onOk" variant="tonal">OK</VBtn>
            </VCardActions>
        </VCard>
    </VDialog>
</template>
<script setup lang="ts">

import { reactive, ref } from 'vue';
import TrafficLight from './TrafficLight.vue';
import SliderValue from './SliderValue.vue';
import type { Dataset } from '@/types';
import { useDatasets } from '@/composables/useDatasets';

const { datasets } = useDatasets()

const dialog = ref(false)
let dataset: Dataset
const emits = defineEmits<{ dataset: [Dataset] }>()
let mode: 'edit' | 'add'

defineExpose({
    edit(idx: number) {
        dataset = datasets[idx]
        console.log(dataset)
        dialog.value = true
        mode = 'edit'
    },
    add() {
        dataset = reactive({ lights: [0, 0, 0], pressure: 0 })
        dialog.value = true
        mode = 'add'
    }
})
const r = () => parseFloat((Math.random()).toFixed(1))
function setAll(v: null | number) {
    if (v === 0) {
        dataset.lights = [0, 0, 0]
        dataset.pressure = 0
    } else {
        dataset.lights = [r(), r(), r()]
        dataset.pressure = r()
    }
}
function onOk() {
    datasets.push(dataset)
    dialog.value = false
}

</script>
