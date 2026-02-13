<script setup lang="ts">
import { computed } from "vue"

const props = defineProps<{
    losses: number[]
    currentEpoch: number
}>()


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
            <v-sparkline :gradient="['#f72047', '#ffd200', '#1feaea']" :model-value="losses" color="blue" line-width="2" padding="8" smooth auto-draw />

            <slot/>
        </v-card-text>
    </v-card>
</template>
