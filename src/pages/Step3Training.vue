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
            <v-select title="Select sample to train" :disabled="training" :items="selectSampleOptions"
                v-model="selectedSample" variant="outlined" hide-details density="compact" />
            <v-btn @click="oneEpoch" color="primary" :disabled="training" prependIcon="mdi-play">One Step</v-btn>
            <v-btn style="width: 105px;" @click="stop" color="error" v-show="training"
                prependIcon="mdi-stop">Stop</v-btn>
            <v-btn style="width: 105px;" @click="start" color="success" v-show="!training"
                prependIcon="mdi-play">START</v-btn>
        </template>
    </VAppBar>
    <!-- <VProgressLinear color="primary" absolute v-if="training" indeterminate /> -->

    <v-row>
        <v-col :cols="4" sm="3">
            <div ref="trainMenu" style="background-color: rgb(var(--v-theme-surface));">
                <v-list-item title="Stepper"></v-list-item>
                <v-list-item v-for="(t, i) in steps" @click="step(i)" density="compact"
                    :disabled="i !== 0 && currentStep === null || currentStep + 1 < i" :title="t"
                    :active="currentStep === i" color="primary">
                    <template #prepend>
                        <v-avatar class="hidden-xs">{{ i + 1 }}</v-avatar>
                    </template>
                </v-list-item>
                <v-list-item density="comfortable" @click="step(null)" :disabled="currentStep + 1 < steps.length"
                    title="Done">
                    <template #prepend>
                        <v-avatar class="hidden-xs">{{ steps.length + 1 }}</v-avatar>
                    </template>
                </v-list-item>
                <v-divider />
                <div class="pa-3 d-flex justify-center">
                    <VCheckbox v-model="autoscroll" density="compact" hide-details label="Auto-scroll" />
                </div>
                <TrafficLight :model-value="[0.5, 0, 1]" />

            </div>
        </v-col>
        <v-col :cols="8" sm="9" class="text-center">
            <!-- <v-sheet class="mb-3 pa-4">
                How to get correct weight values to achieve desired target output that fit for all samples?
            </v-sheet> -->
            <ModelStats :model="model" />
            <v-sheet class="my-3">
                <TrainingVector ref="trainingVector" />
            </v-sheet>
            <TrainingStats class="mt-3" />
            <v-sheet class="py-2">
                <table style="width: 100%; border-collapse: collapse;" class="text-body-2">
                    <tbody>
                        <tr>
                            <td :class="{ 'border-s': !!index, 'text-green': v.isOk }" class="text-center"
                                v-for="([action, v], index) of sampleStats" :key="action">
                                <div>
                                    <b :class="{ 'text-primary': action === currentAction }">{{ ActionLabel[action]
                                        }}</b>
                                </div>
                                <code>Target: {{ v.target.toFixed(3) }}</code><br />
                                <code>Predicted: {{ v.predicted.toFixed(3) }}</code><br />
                                <code>Error: {{ v.error.toFixed(3) }}</code><br />
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
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { useDatasets } from '@/composables/useDatasets';
import { useModel } from '@/composables/useModel';
import { useSticky } from '@/composables/useSticky';
import type { MapValue } from '@/types';
import { ActionLabel, getActionCategory } from '@/utils/traffic-light.util';
import { nextTick, onMounted, onUnmounted, reactive, ref, shallowRef, type GlobalComponents, type ShallowRef } from 'vue';

const { datasets } = useDatasets()
const { model, predict, biasChanges, weightChanges, latestLoss } = useModel()

const training = ref(false)
const trainMenu = shallowRef<HTMLDivElement>()
const trainingVector = shallowRef<InstanceType<GlobalComponents['TrainingVector']>>()
const sticky = useSticky(trainMenu)
const autoscroll = ref(true)
const currentStep = ref<number | null>(null)

const steps = ['Predict', 'Residual', 'Gradients', 'Optimizer']
const samples = datasets.map(v => ({
    action: getActionCategory(v.pressure),
    target: v.pressure,
    inputs: v.lights
}))

/** unique digits */
const actions = [...new Set(samples.map(v => v.action))]
const sampleStats = ref(new Map(actions.map(v => [v, {
    error: NaN,
    predicted: NaN,
    target: samples.find(s => s.action == v)?.target,
    changes: 0,
    isOk: false
}])))

let sampleIndex = 0
const currentAction = ref(samples[sampleIndex].action)
const selectedSample = ref(null as number | null)
const selectSampleOptions = ref([
    { value: null, title: 'All' },
    ...samples.map((v, i) => ({ value: i, title: v.action.toString() }))
])

let stat: MapValue<typeof sampleStats.value>

function oneEpoch() {
    training.value = true
    oneStage().finally(() => training.value = false)
}

async function oneStage() {
    await step(0)
    if (!training.value) return Promise.reject(new Error('Stopped by user'))
    await step(1)
    if (!training.value) return Promise.reject(new Error('Stopped by user'))
    await step(2)
    if (!training.value) return Promise.reject(new Error('Stopped by user'))
    await step(3)
    if (!training.value) return Promise.reject(new Error('Stopped by user'))
    await step(null)
}

function multiEpochs() {
    oneStage().then(
        () => {
            if (!training.value) return
            // Check all OK
            for (const [i, v] of sampleStats.value) {
                if (!v.isOk) {
                    nextTick(multiEpochs)
                    return
                }
            }
            // Stop it have all OK
            stop()
        }
    )
}

function start() {
    training.value = true
    sampleStats.value.forEach(v => v.isOk = false)
    multiEpochs()
}

function stop() {
    training.value = false
}

const delay = (t = 500) => new Promise(r => setTimeout(r, t))
let output = ref(NaN)
const sample = shallowRef<typeof samples[0]>()
const gradients = shallowRef<number[]>()
let newWeights = []

function step(i: number) {
    currentStep.value = i

    if (autoscroll.value && i !== null) {
        trainingVector.value.scrollToStep(i)
    }

    switch (i) {
        // Predict
        case 0:
            trainingVector.value?.stepDone()
            training.value = true
            if (selectedSample.value === null) {
                sample.value = samples[sampleIndex++]
                if (sampleIndex >= samples.length)
                    sampleIndex = 0
            } else {
                sample.value = samples[selectedSample.value]
            }
            currentAction.value = sample.value.action
            output.value = predict(sample.value.inputs)
            trainingVector.value.step1(sample.value.inputs, sample.value.target, output.value)

            const error = output.value - sample.value.target
            stat = sampleStats.value.get(sample.value.action)
            stat.changes = (stat.error - error)
            stat.error = error
            stat.predicted = output.value
            stat.isOk = parseFloat(output.value.toFixed(3)) == sample.value.target
            break
        // Residual
        case 1:
            trainingVector.value.step2(output.value, sample.value.target)
            break
        // Gradients
        case 2:
            const residual = output.value - sample.value.target
            latestLoss.value = 0.5 * residual ** 2
            gradients.value = [
                residual * sample.value.inputs[0],
                residual * sample.value.inputs[1],
                residual * sample.value.inputs[2],
                residual * 1, // Bias
            ]
            trainingVector.value.step3(gradients.value)
            break
        // Optimizer
        case 3:


            newWeights = [
                model.weights[0] - model.learningRate * gradients.value[0],
                model.weights[1] - model.learningRate * gradients.value[1],
                model.weights[2] - model.learningRate * gradients.value[2],
                model.bias - model.learningRate * gradients.value[3]
            ]

            trainingVector.value.step4(newWeights)
            break

        case null:
            if (newWeights.length) {
                weightChanges.value[0] = newWeights[0] - model.weights[0]
                weightChanges.value[1] = newWeights[1] - model.weights[1]
                weightChanges.value[2] = newWeights[2] - model.weights[2]
                biasChanges.value = newWeights[3] - model.bias

                // apply changes
                model.weights[0] = newWeights[0]
                model.weights[1] = newWeights[1]
                model.weights[2] = newWeights[2]
                model.bias = newWeights[3]
            }
            break
    }

    return delay()
}

function next() {
    if (currentStep.value === null) {
        currentStep.value = 0
    } else {
        currentStep.value++
        if (currentStep.value >= steps.length) {
            currentStep.value = null
        }
    }

}

// function stepDone() {
//     //reset()

// }

onMounted(() => {
    step(null)
    // trainingVector.value?.stepDone()
})

onUnmounted(() => {
    sticky.stop()
})

</script>