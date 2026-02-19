<script setup lang="ts">
import { computed } from "vue"
import GasPedal from "./GasPedal.vue";
import ChipColor from "./ChipColor.vue";
import { VCol } from "vuetify/components";

const props = defineProps<{
    losses: number[]
    currentEpoch: number
}>()

const loss = computed(() => {
    if (props.losses.length < 3) return '-'
    return (props.losses.slice(-3).reduce((p, c) => p + c, 0) / 3)
        .toFixed(3)
})

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
            Learning Progress (Epochs {{ currentEpoch }})

        </v-card-title>

        <v-card-subtitle>
            Loss: {{ loss }}
        </v-card-subtitle>
        <v-card-text>
            <v-sparkline :max="1" :min="0" :gradient="['#f72047', '#ffd200', '#1feaea']" :model-value="losses"
                color="success" line-width="3" padding="8" smooth Xauto-draw />
        </v-card-text>

    </v-card>
</template>
