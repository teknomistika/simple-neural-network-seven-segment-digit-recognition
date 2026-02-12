<script setup lang="ts">
import { computed } from "vue"

const props = defineProps<{
    losses: number[]
    currentEpoch: number
}>()

const latestLoss = computed(() => {
    if (props.losses.length === 0) return "-"
    return props.losses[props.losses.length - 1].toFixed(4)
})

</script>

<template>
    <v-card>
        <v-card-title class="d-flex align-center justify-space-between">
            Learning Progress
            <v-chip size="small" color="primary">
                Epoch {{ currentEpoch }}
            </v-chip>
        </v-card-title>

        <v-card-subtitle>
            Loss (Mean Squared Error)
        </v-card-subtitle>

        <v-card-text>
            <v-sparkline :model-value="losses" color="blue" line-width="2" padding="8" smooth auto-draw />

            <div class="text-caption mt-2">
                Latest loss:
                <strong>{{ latestLoss }}</strong>
            </div>
        </v-card-text>
    </v-card>
</template>
