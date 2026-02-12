<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from "vue";
import Step1RawData from "./pages/Step1Dataset.vue";
import Step2Training from "./pages/Step2Training.vue";
import Step3Inference from "./pages/Step3Inference.vue";

const steps = [
  { value: 1, title: "Dataset" },
  { value: 2, title: "Training" },
  { value: 3, title: "Inference" }
]

const currentStep = ref(
  location.hash?.length > 1 ?
    parseInt(location.hash.slice(1)) :
    1)

watch(currentStep, (step) => {
  location.hash = `#${step}`
})

</script>

<template>
  <v-app theme="dark">
    <v-app-bar elevation="2" extended density="compact">
      <template #prepend>
        <VBtn :disabled="currentStep == 1" @click="--currentStep" prepend-icon="mdi-arrow-left">Prev</VBtn>
      </template>
      <template #append>
        <VBtn :disabled="currentStep == steps.length" @click="++currentStep" append-icon="mdi-arrow-right">Next</VBtn>
      </template>
      <v-app-bar-title>
        <h1 class="text-h6 text-center text-disabled text-truncate">Single-Neuron Seven-Segment Neural Network</h1>
      </v-app-bar-title>
      <template #extension>
        <div class="d-flex flex-column w-100">
          <VStepper :elevation="0" :model-value="currentStep">
            <VStepperHeader key="stepper-header">
              <template v-for="(step, i) of steps" :key="step.value">
                <VDivider v-if="!!i" />
                <VStepperItem color="primary" class="py-0" v-bind="step"></VStepperItem>
              </template>
            </VStepperHeader>
          </VStepper>
        </div>
      </template>
    </v-app-bar>
    <!-- Main Content -->
    <v-main>
      <VWindow v-model="currentStep">
        <VWindowItem :value="1">
          <Step1RawData v-if="currentStep == 1" />
        </VWindowItem>
        <VWindowItem :value="2">
          <Step2Training v-if="currentStep == 2" />
        </VWindowItem>
        <VWindowItem :value="3">
          <Step3Inference v-if="currentStep == 3" />
        </VWindowItem>
      </VWindow>
    </v-main>

  </v-app>
</template>
