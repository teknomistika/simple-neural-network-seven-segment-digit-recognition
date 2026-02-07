<script setup lang="ts">
import { useSteps } from "@/composables/useSteps"
import Step1RawData from "./pages/Step1RawData.vue";

const { steps, currentStep, setStep } = useSteps()
</script>

<template>
  <v-app>

    <!-- App Bar -->
    <v-app-bar elevation="1">
      <v-app-bar-title>
        Single-Neuron Seven-Segment Neural Network
      </v-app-bar-title>
    </v-app-bar>

    <!-- Navigation Drawer -->
    <v-navigation-drawer permanent width="280">
      <v-list nav>
        <v-list-item v-for="step in steps" :key="step.id" :active="step.id === currentStep" @click="setStep(step.id)"
          rounded="lg">
          <template #prepend>
            <v-avatar size="28" color="primary">
              <span class="text-white text-caption">
                {{ step.id }}
              </span>
            </v-avatar>
          </template>

          <v-list-item-title>
            {{ step.title }}
          </v-list-item-title>

          <v-list-item-subtitle>
            Step {{ step.id }}
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main>
      <v-container fluid>
        <Step1RawData v-if="currentStep === 1" />
        <!-- <StepSegment v-if="currentStep === 2" />
        <StepDataset v-if="currentStep === 3" />
        <StepTraining v-if="currentStep === 4" />
        <StepInference v-if="currentStep === 5" /> -->
      </v-container>
    </v-main>

  </v-app>
</template>
