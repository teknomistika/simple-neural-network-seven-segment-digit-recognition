<script setup lang="ts">
import type DatasetDialog from "@/components/DatasetDialog.vue";
import { useDatasets } from "@/composables/useDatasets";
import { shallowRef } from "vue";

const {
    datasets,
    prefined
} = useDatasets();
const dialog = shallowRef<InstanceType<typeof DatasetDialog>>()

function clearAll() {
    if (!confirm('Delete all?'))
        return
    datasets.splice(0)
}

function deleteIt(idx: number) {
    if (!confirm('Delete this?'))
        return
    datasets.splice(idx, 1)
}


function loadDefaultSample() {
    if (!confirm('Add default samples?'))
        return

    datasets.push(...prefined)
}

</script>

<template>
    <VAppBar elevation="2" location="bottom" :title="`Dataset (${datasets.length} item)`" density="compact">
        <template v-slot:append>
            <v-btn @click="loadDefaultSample" prependIcon="mdi-database-import">Add Predefined</v-btn>
            <v-btn color="error" @click="clearAll" prependIcon="mdi-delete-sweep">Clear</v-btn>
            <v-btn color="success" @click="dialog.add()" prependIcon="mdi-plus">Add</v-btn>
        </template>
    </VAppBar>
    <DatasetDialog ref="dialog" />
    <v-row class="justify-center">
        <v-col v-for="(item, i) in datasets" :key="i" cols="6" sm="4" md="3" lg="2">
            <v-sheet elevation="1" class="text-center rounded elevated">
                <div class="d-flex ga-1 pa-2">
                    <span class="text-disabled">#{{ i + 1 }}</span>
                    <v-spacer />
                    <VBtn @click="dialog.edit(i)" variant="plain" icon="mdi-pencil" density="compact" size="small"
                        color="warning" />

                    <VBtn @click="deleteIt(i)" variant="plain" icon="mdi-delete" density="compact" size="small"
                        color="error" />
                </div>
                <v-divider />
                <div class="pa-2">
                    <p>Light States:</p>
                    <TrafficLight :model-value="item.lights" />
                    <V-divider class="mb-2" />
                    <p>Gas Pedal:</p>
                    <GasPedal :model-value="item.pressure" />
                    <p>Action:</p>
                    <ActionChip :treshold="item.pressure" />
                </div>
            </v-sheet>
        </v-col>
    </v-row>
</template>
