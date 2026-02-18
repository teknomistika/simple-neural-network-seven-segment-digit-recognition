<template>

    <VDialog v-model="dialog" :maxWidth="600">
        <template v-slot:activator="{ props }">
            <slot v-bind="{ props }"></slot>
        </template>
        <VCard title="Add new Sample">
            <VDivider />
            <VCardItem class="pt-0">
                <VRow>
                    <VCol class="text-center">
                        <p>Lights state:</p>
                        <TrafficLight with-sliders v-model="lights" />
                    </VCol>
                    <VCol class="text-center">
                        <p>Gas pedal pressure :</p>
                        <SliderValue v-model="pressure" />
                        <!-- <v-slider v-model="pressure" min="0" max="1" /> -->
                    </VCol>
                </VRow>
            </VCardItem>
            <VCardActions>
                <!-- <VBtn color="warning" @click="clearCanvas">Clear</VBtn>
               <VBtn color="primary" @click="saveDrawing">Download</VBtn> -->
                <VSpacer />
                <VBtn color="success" @click="addToDataset" variant="tonal">Add to Dataset</VBtn>
            </VCardActions>
        </VCard>
    </VDialog>
</template>
<script setup lang="ts">

import { ref, unref } from 'vue';
import TrafficLight from './TrafficLight.vue';
import { useDatasets } from '@/composables/useDatasets';
import SliderValue from './SliderValue.vue';
const { add } = useDatasets()
const dialog = ref(false)
const lights = ref([0, 0, 0])
const pressure = ref(0)

function addToDataset() {
    add(unref(pressure), unref(lights))
    dialog.value = false
}

</script>
