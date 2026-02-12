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
            <v-btn @click="start" color="success" v-show="!training" prependIcon="mdi-play">START</v-btn>
            <v-btn @click="step" color="primary" v-show="!training" prependIcon="mdi-play">One Step</v-btn>
        </template>
    </VAppBar>
    <v-container fluid>
        <VProgressLinear color="primary" absolute v-if="training" indeterminate />
        <v-row>
            <v-col>
                <ModelStats :model="model" />
                <TrainingStats :losses="lossHistory" :currentEpoch="currentEpoch" />
            </v-col>
        </v-row>
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
import { nextTick, ref, watch } from 'vue';

const lossHistory = ref<number[]>([])
const training = ref(false)
const currentEpoch = ref(0)
const {
    model,
    predict
} = useModel()

let samples: {
    inputs: Vector,
    target: number
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
        target: v.digit / 10,
        inputs: segmentsToVector(v.segments)
    }))
})

function step() {
    const sample = samples[sampleAt++]
    if (sampleAt >= samples.length)
        sampleAt = 0
    const res = predict(sample.inputs)

    const detectedDigit = Math.floor(res * 10);
    // Mean Squared Error derivative
    const error = res - sample.target;

    currentEpoch.value++
    model.totalEpochs++
    lossHistory.value.push(error)
    console.log(sample.target, res, detectedDigit)

    // Backprop (chain rule)
    const dSigmoid = sigmoidDerivative(sample.target);
    const gradient = error * dSigmoid;

    // Update weights
    for (let i = 0; i < model.weights.length; i++) {
        model.weights[i] -= model.learningRate * gradient * sample.inputs[i];
    }

    // Update bias
    model.bias -= model.learningRate * gradient;
}

function multistep() {
    step()
    nextTick(() => {
        if (!training.value) return
        setTimeout(multistep, 0)
    })
}

function start() {
    sampleAt = 0
    currentEpoch.value = 0
    lossHistory.value = []
    training.value = true
}

function stop() {
    training.value = false
}

</script>