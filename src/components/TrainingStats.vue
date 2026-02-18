<script setup lang="ts">
import { computed } from "vue"
import GasPedal from "./GasPedal.vue";
import ChipColor from "./ChipColor.vue";
import { VCol } from "vuetify/components";

const props = defineProps<{
    losses: number[]
    currentEpoch: number
}>()

const accuracy = computed(() => {
    if (props.losses.length < 3) return '??'

    return (
        100 * (1 - props.losses.slice(-3).reduce((p, c) => p + c, 0) / 3)
    ).toFixed() + '%'
})

</script>

<template>
    <v-card>
        <v-card-title class="d-flex align-center justify-space-between">
            Learning Progress

        </v-card-title>

        <v-card-subtitle>
            Loss (Mean Squared Error)
        </v-card-subtitle>

        <v-row>
            <v-col cols="9">
                <v-sparkline :max="1" :min="0" :gradient="['#f72047', '#ffd200', '#1feaea']" :model-value="losses"
                    color="blue" line-width="2" padding="8" smooth auto-draw />
            </v-col>
            <v-col cols="3" class="d-flex flex-column justify-center text-center">
                <chip-color :value="props.losses.at(-1) || 0" />
                <h3>Progress: {{ accuracy }}</h3>
            </v-col>
        </v-row>
    </v-card>
</template>
