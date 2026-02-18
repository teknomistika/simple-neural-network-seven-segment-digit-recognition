<template>
    <VAppBar style="bottom: 0px; position: fixed;" key="step2-appbar" elevation="2" location="bottom" density="compact">
        <template #title>
            <v-slider :step="0.01" label="Learning Rate" density="compact" v-model="model.learningRate" :max="1"
                :min="0" class="align-center" hide-details>
                <template v-slot:append>
                    <v-text-field step="0.01" v-model="model.learningRate" density="compact" style="width: 90px"
                        type="number" hide-details variant="outlined" single-line></v-text-field>
                </template>
            </v-slider>
        </template>
        <template v-slot:append>
            <v-select :disabled="training" :items="selectSampleOptions" v-model="selectedSample" variant="outlined"
                hide-details density="compact" />
            <v-btn @click="step" color="primary" :disabled="training" prependIcon="mdi-play">One Step</v-btn>
            <v-btn style="width: 105px;" @click="stop" color="error" v-show="training"
                prependIcon="mdi-stop">Stop</v-btn>
            <v-btn style="width: 105px;" @click="start" color="success" v-show="!training"
                prependIcon="mdi-play">START</v-btn>
        </template>
    </VAppBar>
    <!-- <VProgressLinear color="primary" absolute v-if="training" indeterminate /> -->
    <v-row>
        <v-col>
            <ModelStats :model="model" />
            <!-- <TrainingStats class="mt-3" :losses="lossHistory" :currentEpoch="currentEpoch" /> -->
        </v-col>
    </v-row>
    <v-sheet class="mt-3 py-2 rounded">
        <table style="width: 100%; border-collapse: collapse;" class="text-body-2">
            <tbody>
                <tr>
                    <td :class="{ 'border-s': !!index, 'text-green': v.isOk }" class="text-center"
                        v-for="([digit, v], index) of sampleStats" :key="digit">
                        <div><b :class="{ 'text-primary': digit === currentDigit }">{{ digit }}</b></div>
                        <code>{{ v.error.toFixed(3) }}</code><br />
                        <small>
                            <code v-if="v.changes > 0" class="ml-1 text-error">+{{
                                v.changes.toFixed(3) }}</code>
                            <code v-else-if="v.changes < 0" class="ml-1 text-success">{{
                                v.changes.toFixed(3) }}</code>
                            <code v-else class="ml-1 text-disabled">&mdash;</code>
                        </small>
                    </td>
                </tr>
            </tbody>
        </table>
    </v-sheet>
</template>

<script setup lang="ts">
import ModelStats from '@/components/ModelStats.vue';
import { useDatasets } from '@/composables/useDatasets';
import { useModel } from '@/composables/useModel';
import type { MapValue, Vector } from '@/types';
import { SEVEN_SEGMENT_CHARSET } from '@/utils/seven-segment.util';
import { nextTick, ref, shallowRef, watch } from 'vue';

const { datasets: { value: datasets } } = useDatasets()
const { model, predict, train, weightChanges, biasChanges } = useModel()

const lossHistory = shallowRef<number[]>([])
const training = ref(false)

const samples = datasets.map(v => ({
    digit: v.digit,
    target: v.digit,
    inputs: SEVEN_SEGMENT_CHARSET.map(
        c => v.segments.includes(c) ? 1.0 : 0.0
    ) as Vector
}))

/** unique digits */
const digits = [...new Set(datasets.map(v => v.digit))]
const sampleStats = ref(new Map(digits.map(v => [v, {
    error: NaN,
    changes: 0,
    isOk: false
}])))

let sampleIndex = 0
const currentDigit = ref(samples[sampleIndex].digit)
const selectedSample = ref(null as number | null)
const selectSampleOptions = ref([
    { value: null, title: 'All' },
    ...samples.map((v, i) => ({ value: i, title: v.digit.toString() }))
])

let stat: MapValue<typeof sampleStats.value>, sample: typeof samples[0]
function step() {
    if (selectedSample.value === null) {
        sample = samples[sampleIndex++]
        if (sampleIndex >= samples.length)
            sampleIndex = 0
    } else {
        sample = samples[selectedSample.value]
    }
    currentDigit.value = sample.digit
    // const sample = samples[currentDigit.value] // train one only
    const { output, error } = train(sample.target, sample.inputs)

    // Update UI
    model.totalEpochs++

    stat = sampleStats.value.get(sample.digit)
    stat.changes = (stat.error - error)
    stat.error = error
    stat.isOk = (Math.round(output)) == sample.target

    if (lossHistory.value.length >= 50) {
        lossHistory.value = [...lossHistory.value.slice(1), error]
    } else {
        lossHistory.value = [...lossHistory.value, error]
    }
}

function multistep() {
    step()
    nextTick(() => {
        if (!training.value) return
        // Check all OK
        for (const [i, v] of sampleStats.value) {
            if (!v.isOk) {
                // nextTick
                setTimeout(multistep, 0)
                break
            }
        }
        // Stop it have all OK
    })
}

function start() {
    lossHistory.value = []
    training.value = true
    console.log(model, sampleStats.value)
    multistep()
}

function stop() {
    training.value = false
}

</script>