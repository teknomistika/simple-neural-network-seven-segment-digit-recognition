<script setup lang="ts">
import { ref, watch } from "vue";

const steps = Object.entries(import.meta.glob('./pages/*.vue', {
  eager: true,
  import: 'default'
})).map(([k, v], i) => ({
  value: i + 1,
  title: k.match(/\/.+\d+(?<name>.+)\./).groups.name,
  is: v
}))

const currentStep = ref(parseInt(location.hash?.slice(1) || "1"))

watch(currentStep, (step) => {
  location.hash = `#${step}`
})

</script>

<template>
  <v-app theme="dark">
    <v-app-bar elevation="2" extended density="compact">
      <template #prepend>
        <VBtn :disabled="!currentStep" @click="--currentStep" prepend-icon="mdi-arrow-left">Prev</VBtn>
      </template>
      <template #append>
        <VBtn :disabled="currentStep == steps.length" @click="++currentStep" append-icon="mdi-arrow-right">Next</VBtn>
      </template>
      <v-app-bar-title>
        <h1 class="text-h6 text-center text-disabled text-truncate">A Simple Neural Network for Traffic Light
          Decisions
        </h1>
      </v-app-bar-title>
      <template #extension>
        <div class="d-flex flex-column w-100">
          <VStepper :elevation="0" :model-value="currentStep">
            <VStepperHeader key="stepper-header">
              <template v-for="(step, i) of steps" :key="step.value">
                <VDivider v-if="!!i" />
                <VStepperItem color="primary" class="py-0" v-bind="step" />
              </template>
            </VStepperHeader>
          </VStepper>
        </div>
      </template>
    </v-app-bar>
    <!-- Main Content -->
    <v-main>
      <VWindow v-model="currentStep">
        <VWindowItem :value="step.value" v-for="(step, i) of steps" :key="step.value">
          <Component v-if="currentStep == step.value" :is="step.is" />
        </VWindowItem>
      </VWindow>
    </v-main>
  </v-app>
</template>
