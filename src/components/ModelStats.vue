<script setup lang="ts">
import { useModel } from "@/composables/useModel";
import { computed } from "vue"

const {
    model, randomize, zero, weightChanges
} = useModel()

const formattedCreatedAt = computed(() =>
    model.createdAt.toLocaleString()
)

const formattedUpdatedAt = computed(() =>
    model.updateAt.toLocaleString()
)



</script>

<template>
    <!-- Weights -->
    <v-row>
        <v-col cols="12" sm="9">
            <v-card density="compact" title="Model Weights">
                <table style="width: 100%; border-collapse: collapse;" class="border-t text-body-2">
                    <tbody>
                        <tr>
                            <td :class="{ 'border-s': !!index }" class="text-center pt-1"
                                v-for="(weight, index) in model.weights" :key="index">
                                <code>{{ weight.toFixed(4) }}</code>
                            </td>
                        </tr>
                        <tr>
                            <td :class="{ 'border-s': !!index }" class="text-center pb-1"
                                v-for="(changes, index) in weightChanges" :key="index">
                                <span v-if="changes > 0" class="ml-1 text-success">+{{
                                    changes.toFixed(3) }}</span>
                                <span v-else-if="changes < 0" class="ml-1 text-error">{{
                                    changes.toFixed(3) }}</span>
                                <span v-else class="ml-1 text-disabled">&mdash;</span>
                            </td>
                        </tr>
                    </tbody>

                </table>
                <v-divider />
                <v-card-text>
                    <v-slider label="Bias" v-model="model.bias" :max="5" :min="-5" class="align-center" hide-details>
                        <template v-slot:append>
                            <v-text-field v-model="model.bias" density="compact" style="width: 120px" type="number"
                                hide-details variant="outlined" single-line></v-text-field>
                        </template>
                    </v-slider>
                </v-card-text>
                <v-divider />
                <v-card-actions>
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
