<template>
    <v-sheet class="pa-4">
        <div class="d-flex mt-4 align-center justify-center">
            <TrafficLight style="min-width: 200px" slider-only :model-value="inputs" />
            <div>
                <InferenceVector :inputs="inputs" :output="output" />
            </div>
            <div class="px-4 pb-10">
                <p>Gas Pedal:</p>
                <GasPedal :model-value="output" />
            </div>
            <div class="px-4 pb-10 text-center">
                <p>Action:</p>
                <ActionChip style="width: 80px; justify-content: center;" :treshold="output" />
            </div>
        </div>
    </v-sheet>
</template>

<script setup lang="ts">
import { useDatasets } from '@/composables/useDatasets';
import { useModel } from '@/composables/useModel';
import { onMounted, ref, watch } from 'vue';

const { predict } = useModel()
const { datasets } = useDatasets()

const inputs = ref([0, 0, 0])
const output = ref(0)

watch(inputs, (v) => {
    output.value = predict(v)
}, { deep: true })

function setSample(i = 0) {
    inputs.value = [...datasets[i].lights]
}

onMounted(setSample)

</script>