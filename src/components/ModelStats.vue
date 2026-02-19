<script setup lang="ts">
import { useModel } from "@/composables/useModel";
import { computed } from "vue"
import Changes from "./Changes.vue";

const {
    model, randomize, zero, weightChanges, biasChanges
} = useModel()


</script>

<template>
    <v-card density="compact">
        <v-card-title class="d-flex ga-2">
            <div>Current Model Weights</div>
            <v-spacer/>
            <v-btn density="compact" variant="tonal" color="warning" @click="randomize"
                prependIcon="mdi-close-circle-multiple">Randomize</v-btn>
            <v-btn density="compact" variant="tonal" color="" @click="zero"
                prependIcon="mdi-close-circle-multiple">Zero ALL</v-btn>

        </v-card-title>
        <table style="width: 100%; border-collapse: collapse; table-layout: fixed;"
            class="border-t text-body-2 text-center">
            <tbody>
                <tr>
                    <td class="py-2 border-e" v-for="(weight, index) in model.weights" :key="index">
                        W<sub>{{ index + 1 }}</sub><br /><code>{{ weight.toFixed(4) }}</code>
                        <sup>
                            <changes :value="weightChanges[index]" />
                        </sup>
                    </td>
                    <td class="py-2">
                        Bias:<br />
                        <code>{{ model.bias.toFixed(4) }}</code>
                        <sup>
                            <changes :value="biasChanges" />
                        </sup>
                    </td>
                </tr>
            </tbody>
        </table>
    </v-card>

</template>
