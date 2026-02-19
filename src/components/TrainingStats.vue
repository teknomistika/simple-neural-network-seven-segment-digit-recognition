<script setup lang="ts">
import { useModel } from "@/composables/useModel";
import { computed, reactive, ref, watch } from "vue"
const { model, latestLoss } = useModel()

const losses = reactive<number[]>([])
watch(latestLoss, loss => losses.push(loss))

const loss = computed(() => {
    if (losses.length < 3) return losses.at(-1) || NaN
    return (losses.slice(-3).reduce((p, c) => p + c, 0) / 3)

})

</script>

<template>
    <v-card>
        <v-card-title class="d-flex align-center justify-space-between">
            <v-spacer class="text-center">
                Learning Progress:
                Epochs <code>{{ model.totalEpochs }}</code> Loss: <text-color
                    :value="loss"><code>{{ loss?.toFixed(4) }}</code></text-color>
            </v-spacer>
            <v-btn @click="losses.splice(0)" prepend-icon="mdi-close" density="comfortable" color="warning"
                variant="plain">Clear</v-btn>
        </v-card-title>
        <v-card-subtitle>
        </v-card-subtitle>
        <v-card-text>
            <v-sparkline :max="1" :min="0" :gradient="['#f72047', '#ffd200', '#1feaea']" :model-value="losses"
                color="success" line-width="3" padding="8" smooth Xauto-draw />
        </v-card-text>

    </v-card>
</template>
