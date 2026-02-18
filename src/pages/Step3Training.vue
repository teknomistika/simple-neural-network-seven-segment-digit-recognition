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
            <TrainingStats class="mt-3" :losses="lossHistory" :currentEpoch="model.totalEpochs" />
        </v-col>
    </v-row>
    <v-sheet class="mt-3 py-2 rounded">
        <table style="width: 100%; border-collapse: collapse;" class="text-body-2">
            <tbody>
                <tr>
                    <td :class="{ 'border-s': !!index, 'text-green': v.isOk }" class="text-center"
                        v-for="([action, v], index) of sampleStats" :key="action">
                        <div>
                            <b :class="{ 'text-primary': action === currentDigit }">{{ ActionLabel[action] }}</b>
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
</template>

<script setup lang="ts">
import ActionChip from '@/components/ActionChip.vue';
import ModelStats from '@/components/ModelStats.vue';
import TrainingStats from '@/components/TrainingStats.vue';
import { useDatasets } from '@/composables/useDatasets';
import { useModel } from '@/composables/useModel';
import type { MapValue, Vector } from '@/types';
import { Action, ActionLabel, getActionCategory } from '@/utils/traffic-light.util';
import { nextTick, ref, shallowRef, watch } from 'vue';

const { datasets } = useDatasets()
const { model, predict, train, weightChanges, biasChanges } = useModel()

const lossHistory = shallowRef<number[]>([])
const training = ref(false)

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
const currentDigit = ref(samples[sampleIndex].action)
const selectedSample = ref(null as number | null)
const selectSampleOptions = ref([
    { value: null, title: 'All' },
    ...samples.map((v, i) => ({ value: i, title: v.action.toString() }))
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
    currentDigit.value = sample.action
    // const sample = samples[currentDigit.value] // train one only
    const { output, error } = train(sample.target, sample.inputs)

    // Update UI
    model.totalEpochs++

    stat = sampleStats.value.get(sample.action)
    stat.changes = (stat.error - error)
    stat.error = error
    stat.predicted = output
    stat.isOk = getActionCategory(output) == sample.action

    if (lossHistory.value.length >= 50) {
        lossHistory.value = [...lossHistory.value.slice(1), Math.abs(error)]
    } else {
        lossHistory.value = [...lossHistory.value, Math.abs(error)]
    }
}

function multistep() {
    step()
    nextTick(() => {
        if (!training.value) return
        setTimeout(multistep, 0)

        // Check all OK
        // for (const [i, v] of sampleStats.value) {
        //     if (!v.isOk) {
        //         // nextTick
        //         setTimeout(multistep, 0)
        //         break
        //     }
        // }
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