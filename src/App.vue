<script setup lang="ts">
import { nextTick, onMounted, ref } from "vue";
import Step1RawData from "./pages/Step1Dataset.vue";

const steps = [
  { value: 1, title: "Dataset" },
  { value: 2, title: "Training" },
  { value: 3, title: "Inference" }
]

const currentStep = ref(1)


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
          <Step1RawData />
        </VWindowItem>
        <VWindowItem :value="2">
          <v-card title="Step Two" flat>...</v-card>
        </VWindowItem>
        <VWindowItem :value="3">
          <v-card title="Step Three" flat>...</v-card>
        </VWindowItem>


      </VWindow>
      <!-- <VStepper :model-value="currentStep" >
        <VStepperWindow key="stepper-window">
AAA
          <VStepperWindowItem :value="1">
            X
            <Step1RawData />
          </VStepperWindowItem>
          <VStepperWindowItem :value="2">
            <v-card title="Step Two" flat>...</v-card>
          </VStepperWindowItem>
          <VStepperWindowItem :value="3">
            <v-card title="Step Three" flat>...</v-card>
          </VStepperWindowItem>
        </VStepperWindow>
      </VStepper> -->
    </v-main>
    
  </v-app>
</template>
