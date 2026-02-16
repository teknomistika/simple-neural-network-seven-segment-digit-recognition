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
            <v-select :disabled="training" :items="trainDigitOptions" v-model="currentDigit" variant="outlined"
                hide-details density="compact" />
            <v-btn @click="step" color="primary" :disabled="training" prependIcon="mdi-play">One Step</v-btn>
            <v-btn style="width: 105px;" @click="stop" color="error" v-show="training"
                prependIcon="mdi-stop">Stop</v-btn>
            <v-btn style="width: 105px;" @click="start" color="success" v-show="!training"
                prependIcon="mdi-play">START</v-btn>
        </template>
    </VAppBar>
    <v-container fluid>
        <!-- <VProgressLinear color="primary" absolute v-if="training" indeterminate /> -->
        <v-row>
            <v-col>
                <ModelStats :model="model" />
                <!-- <TrainingStats class="mt-3" :losses="lossHistory" :currentEpoch="currentEpoch" /> -->
            </v-col>
        </v-row>
        <v-card class="mt-3">
            <v-card-item>
                <v-row>
                    <v-col v-for="([digit, loss]) in sampleStats" class="border text-center">
                        <div><b :class="{ 'text-primary': digit === currentDigit }">{{ digit }}</b></div>
                        <small><code :class="{ 'text-green': loss.isOk }">{{ loss.error }}</code></small>
                    </v-col>
                </v-row>
            </v-card-item>
        </v-card>
    </v-container>
</template>

<script setup lang="ts">
import ModelStats from '@/components/ModelStats.vue';
import { useDatasets } from '@/composables/useDatasets';
import { useModel } from '@/composables/useModel';
import type { MapValue, Vector } from '@/types';
import { SEVEN_SEGMENT_CHARSET } from '@/utils/seven-segment.util';
import { nextTick, ref, shallowRef, watch } from 'vue';

const { datasets: { value: datasets } } = useDatasets()
const { model, predict, backprop } = useModel()
const samples = datasets.map(v => ({
    digit: v.digit,
    target: v.digit,
    inputs: SEVEN_SEGMENT_CHARSET.map(
        c => v.segments.includes(c) ? 1 : 0
    ) as Vector
}))

const lossHistory = shallowRef<number[]>([])
const training = ref(false)
const sampleStats = ref(new Map(samples.map(v => [v.digit, {
    error: '?.???',
    isOk: false
}])))

let sampleAt: number = 0
const currentDigit = ref(null as number | null)
const trainDigitOptions = ref([{ value: null, title: 'All' }])

watch(training, start => {
    if (start) {
        multistep()
    }
})


trainDigitOptions.value.push(...samples.map(v => ({ value: v.digit, title: v.digit.toString() })))


let reduce = 0, stat: MapValue<typeof sampleStats.value>, sample: typeof samples[0]
function step() {
    if (currentDigit.value === null) {
        sample = samples[sampleAt++]
        currentDigit.value = sample.digit
    } else {
        sample = samples[currentDigit.value]
    }
    // const sample = samples[sampleAt] // train one only
    if (sampleAt >= samples.length)
        sampleAt = 0
    const output = predict(sample.inputs)

    // Mean Squared Error derivative
    const error = output - sample.target;

    // Update UI
    model.totalEpochs++

    stat = sampleStats.value[sample.digit]
    stat.error = error.toFixed(3)
    stat.isOk = (Math.round(output)) == sample.target

    if (lossHistory.value.length >= 50) {
        lossHistory.value = [...lossHistory.value.slice(1), error]
    } else {
        lossHistory.value = [...lossHistory.value, error]
    }
    backprop(output, sample.target, sample.inputs)
    //
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
    sampleAt = 0
    lossHistory.value = []
    training.value = true
    console.log(model, sampleStats.value)
}

function stop() {
    training.value = false
}

</script>