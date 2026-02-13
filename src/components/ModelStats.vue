<script setup lang="ts">
import { useModel } from "@/composables/useModel";
import type { MicroNNModel } from "@/types";
import { computed } from "vue"
const {
    model,
    save, createRandomModel
} = useModel()

const props = defineProps<{
    model: MicroNNModel
}>()

const formattedCreatedAt = computed(() =>
    props.model.createdAt.toLocaleString()
)

const formattedUpdatedAt = computed(() =>
    props.model.updateAt.toLocaleString()
)

function randomize() {
    if (!confirm('Randomize model?')) return
    const newModel = createRandomModel()
    model.weights = newModel.weights
    model.bias = newModel.bias
    model.createdAt = newModel.createdAt
    model.updateAt = newModel.updateAt
    model.totalEpochs = newModel.totalEpochs
}
function zero() {
    if (!confirm('zero all values?')) return
    model.weights = model.weights.map(v => 0)
    model.bias = 0
    model.createdAt = new Date()
    model.updateAt = model.createdAt
    model.totalEpochs = 0
}

</script>

<template>
    <!-- Weights -->
    <v-row>
        <v-col cols="12" sm="9">
            <v-card  density="compact" title="Model Info: Weights (a–g):">
                <v-card-text>
                    <div class="d-flex ga-1 mt-2 justify-center">
                        <v-chip density="comfortable" variant="outlined" v-for="(weight, index) in model.weights"
                            :key="index" size="small" color="primary">
                            {{ weight.toFixed(4) }}
                        </v-chip>
                    </div>
                </v-card-text>
                <v-divider />
                <v-card-text>
                    <v-slider label="Bias" v-model="model.bias" :max="5" :min="-5" class="align-center" hide-details>
                        <template v-slot:append>
                            <v-text-field v-model="model.bias" density="compact" style="width: 120px" type="number"
                                hide-details variant="outlined" single-line></v-text-field>
                        </template>
                    </v-slider>
                </v-card-text>
                <v-divider/>
                <v-card-actions>
                    <v-btn density="compact" variant="tonal" color="primary" prependIcon="mdi-database-import">Load
                        Pretrained Model</v-btn>
                    <v-spacer />
                    <v-btn density="compact" variant="tonal" color="warning" @click="randomize"
                        prependIcon="mdi-close-circle-multiple">Randomize</v-btn>
                    <v-btn density="compact" variant="tonal" color="warning" @click="zero"
                        prependIcon="mdi-close-circle-multiple">Reset</v-btn>
                </v-card-actions>
            </v-card>

        </v-col>
        <v-col cols="12" sm="3">
            <v-card density="compact">

                <v-card-text>
                    <v-row>
                        <v-col cols="12" md="6">
                            <strong>Total Epochs:</strong><br />
                            {{ model.totalEpochs }}
                        </v-col>
                        <v-col cols="12" md="6">
                            <strong>Created At:</strong><br />
                            {{ formattedCreatedAt }}
                        </v-col>

                        <v-col cols="12" md="6">
                            <strong>Last Updated:</strong><br />
                            {{ formattedUpdatedAt }}
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>

</template>
