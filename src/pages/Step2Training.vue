<template>
    <VAppBar style="bottom: 0px; position: fixed;" key="step2-appbar" elevation="2" location="bottom" density="compact">
        <template #title>
            <v-slider label="Learning Rate" v-model="model.learningRate" :max="1" :min="0" class="align-center"
                hide-details>
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
                <ModelStats :model="model" />
                <TrainingStats class="mt-3" :losses="lossHistory" :currentEpoch="currentEpoch" />
            </v-col>
        </v-row>
        <v-card class="mt-3">
            <v-card-item>
                <v-row>
                    <v-col v-for="(loss, digit) in lastResults" class="border">
                        <div class="text-center"><b>{{ digit }}</b></div>
                        <small><code>{{ loss }}</code></small>
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
import { sigmoidDerivative } from '@/utils/math.util';
import { segmentsToVector } from '@/utils/seven-segment.util';
import { nextTick, ref, shallowRef, watch } from 'vue';

const lossHistory = shallowRef<number[]>([])
const training = ref(false)
const currentEpoch = ref(0)
const lastResults = ref(Array.from({ length: 10 }).map((_, i) => '?.????'))

const {
    model,
    predict
} = useModel()

let samples: {
    inputs: Vector,
    digit: number
}[] = []

let sampleAt: number = 0

watch(training, start => {
    if (start) {
        multistep()
    }
})

const { ready } = useDatasets()
ready.then(s => {
    // Tokenize
    samples = s.map(v => ({
        digit: v.digit,
        inputs: segmentsToVector(v.segments)
    }))
})

function step() {
    const sample = samples[sampleAt++]
    // const sample = samples[0] // train zero only
    if (sampleAt >= samples.length)
        sampleAt = 0
    const outputDigit = predict(sample.inputs)

    // Mean Squared Error derivative
    const error = outputDigit - sample.digit;
    lastResults.value[sample.digit] = error.toFixed(4)
    currentEpoch.value++
    model.totalEpochs++
    if (lossHistory.value.length >= 50) {
        lossHistory.value = [...lossHistory.value.slice(1), error]
    } else {
        lossHistory.value = [...lossHistory.value, error]
    }
    
    // Backprop (chain rule)
    

    // Update weights
    for (let i = 0; i < model.weights.length; i++) {
        model.weights[i] -= model.learningRate * error * sample.inputs[i];
    }

    // Update bias
    model.bias -= model.learningRate * error;
}
const bestModel = {
    "learningRate": 0.048960508130678974,
    "weights": [
        2.0004306740117825,
        0.44211855120097593,
        0.47405203806441754,
        -1.2549670125424288,
        0.06007098295387228,
        1.0443029306882907,
        0.3640731913292171
    ],
    "bias": -5.504749673446708,
    "createdAt": "2026-02-13T01:37:09.863Z",
    "updateAt": "2026-02-13T01:37:09.863Z",
    "totalEpochs": 195890
}
/*
    0: 0.6084789914492688
    1: 0.0007411852013835818
    2: 0.00012709346365588625
    3: -0.00024358835535953638
    4: -0.00016165010766983068
    5: 0.0342736691040042
    6: -0.03578267762226095
    7: -0.00008417394282367319
    8: 0.053626379549098324
    9: -0.09472177407986238
*/
function multistep() {
    step()
    nextTick(() => {
        if (!training.value) return
        // nextTick(multistep)
        setTimeout(multistep, 0)
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