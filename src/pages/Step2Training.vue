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
                <!-- <TrainingStats class="mt-3" :losses="lossHistory" :currentEpoch="currentEpoch" /> -->
            </v-col>
        </v-row>
        <v-card class="mt-3">
            <v-card-item>
                <v-row>
                    <v-col v-for="(loss, digit) in lastResults" :class="{'text-green': loss.isOk, 'bg-primary': digit === currentDigit}" class="border">
                        <div class="text-center"><b>{{ digit }}</b></div>
                        <small><code>{{ loss.error  }}</code></small>
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
const lastResults = ref(Array.from({ length: 10 }).map(
    (_, i) => ({
        error: '?.???',
        isOk: false
    }))
)

const {
    model,
    predict
} = useModel()

let samples: {
    inputs: Vector,
    target: number/* Charcode of "0" */,
    digit: number
}[] = []

let sampleAt: number = 0
const currentDigit = ref(null as number | null)

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
        target: v.digit/10,
        inputs: segmentsToVector(v.segments)
    }))
})
let reduce = 0, stat: typeof lastResults.value[0]
function step() {
    const sample = samples[sampleAt++]
    // currentDigit.value = sample.digit
    // const sample = samples[5] // train zero only
    if (sampleAt >= samples.length)
        sampleAt = 0
    const output = predict(sample.inputs)

    // Mean Squared Error derivative
    const error = output - sample.target;
    stat = lastResults.value[sample.digit]
    stat.error = error.toFixed(3)
    
    stat.isOk = Math.abs(error) < 0.1 
    currentEpoch.value++
    model.totalEpochs++
    if (lossHistory.value.length >= 50) {
        lossHistory.value = [...lossHistory.value.slice(1), error]
    } else {
        lossHistory.value = [...lossHistory.value, error]
    }
    
    // Backprop (chain rule)
       // Backprop (chain rule)
    // const totalFilled = sample.inputs.filter(Boolean).length
    // const dSigmoid = sigmoidDerivative(sample.target);
    const gradient =  error * sample.target;

    // Update weights
    for (let i = 0; i < model.weights.length; i++) {
        reduce = model.learningRate * gradient * sample.inputs[i];
        model.weights[i] -= reduce
    }

    // Update bias
    model.bias -= model.learningRate * gradient;
}
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