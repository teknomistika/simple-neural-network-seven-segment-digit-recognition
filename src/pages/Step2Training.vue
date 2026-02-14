<template>
    <VAppBar style="bottom: 0px; position: fixed;" key="step2-appbar" elevation="2" location="bottom" density="compact">
        <template #title>
            <v-slider :step="0.01" label="Learning Rate" v-model="model.learningRate" :max="1" :min="0"
                class="align-center" hide-details>
                <template v-slot:append>
                    <v-text-field v-model="model.learningRate" density="compact" style="width: 120px" type="number"
                        hide-details variant="outlined" single-line></v-text-field>
                </template>
            </v-slider>
        </template>
        <template v-slot:append>
            <v-btn @click="stop" color="error" v-show="training" prependIcon="mdi-stop">Stop</v-btn>
            <v-btn @click="step" color="primary" v-show="!training" prependIcon="mdi-play">One Step</v-btn>
            <v-btn @click="start" color="success" v-show="!training" prependIcon="mdi-play">START</v-btn>
        </template>
    </VAppBar>
    <v-container fluid>
        <!-- <VProgressLinear color="primary" absolute v-if="training" indeterminate /> -->
        <v-row>
            <v-col>
                <!-- <ModelStats :model="model" /> -->
                <!-- <TrainingStats class="mt-3" :losses="lossHistory" :currentEpoch="currentEpoch" /> -->
            </v-col>
        </v-row>
        <v-card class="mt-3">
            <v-card-item>
                <v-row>
                    <v-col v-for="(loss, digit) in lastResults"
                        :class="{ 'text-green': loss.isOk, 'bg-primary': digit === currentDigit }" class="border">
                        <div class="text-center"><b>{{ digit }}</b></div>
                        <small><code>{{ loss.predicted }}</code></small>
                    </v-col>
                </v-row>
            </v-card-item>
        </v-card>
    </v-container>
</template>

<script setup lang="ts">
import ModelStats from '@/components/ModelStats.vue';
import TrainingStats from '@/components/TrainingStats.vue';
import { useDatasets } from '@/composables/useDatasets';
import { useModel } from '@/composables/useModel';
import type { Dataset, Vector } from '@/types';
import { SEVEN_SEGMENT_CHARSET } from '@/utils/seven-segment.util';
import { nextTick, ref, shallowRef, watch } from 'vue';

const lossHistory = shallowRef<number[]>([])
const training = ref(false)
const currentEpoch = ref(0)
const lastResults = ref(Array.from({ length: 10 }).map(
    (_, i) => ({
        errors: Array(10).fill('?.???'),
        scores: Array(10).fill('?.???'),
        predicted: '?' as any,
        isOk: false
    }))
)

const { model, predict, train, inputSize, outputSize } = useModel()

let samples: ReturnType<typeof makeSamples> = []
let sampleAt: number = 0

const currentDigit = ref(null as number | null)

watch(training, start => {
    if (start) {
        multistep()
    }
})
function makeSamples(s: Dataset[]) {
    return s.map(({ digit, segments }) => {
        // Create target vector, only one output is set at the index
        const target: Vector = Array(outputSize).fill(0)
        target[digit] = 1
        const inputs: Vector = SEVEN_SEGMENT_CHARSET.map(
            c => segments.includes(c) ? 0.1 : 0
        )
        return { digit, target, inputs }
    })

}
const { ready } = useDatasets()
ready.then(s => samples = makeSamples(s))

function step() {
    const sample = samples[sampleAt++]
    // const sample = samples[1] // train one only
    // currentDigit.value = sample.digit
    if (sampleAt >= samples.length)
        sampleAt = 0

    const scores = predict(sample.inputs)

    const { predicted, errors } = train(scores, sample.target, sample.inputs)

    // Update UI
    currentEpoch.value++
    model.value.totalEpochs++

    const stat = lastResults.value[sample.digit]
    stat.errors = errors
    stat.scores = scores
    stat.isOk = predicted == sample.digit
    stat.predicted = errors[sample.digit].toFixed(4)
    const error = lastResults.value.length - lastResults.value.filter( v => v.isOk).length
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
        if (lastResults.value.length == lastResults.value.filter(v => v.isOk).length) {
            // Stop it have all OK
        } else {
            // nextTick(multistep)
            setTimeout(multistep, 0)
        }
    })
}

function start() {
    sampleAt = 0
    currentEpoch.value = 0
    lossHistory.value = []
    training.value = true
    console.log(model, lastResults.value)
}

function stop() {
    training.value = false
}

</script>