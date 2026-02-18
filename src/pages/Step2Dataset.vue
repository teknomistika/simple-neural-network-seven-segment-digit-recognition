<script setup lang="ts">
import DatasetDialog from "@/components/DatasetDialog.vue";
import TrafficLight from "@/components/TrafficLight.vue";
import { useDatasets } from "@/composables/useDatasets";
import type { Dataset, Vector } from "@/types";
import { shallowRef } from "vue";

const {
    datasets,
    prefined
} = useDatasets();
const dialog = shallowRef<InstanceType<typeof DatasetDialog>>()

function datasetDialogOk(item: Dataset) {
    if (selected) {
        datasets.value[selected].lights = item.lights
        datasets.value[selected].pressure = item.pressure
        selected = null
    } else {
        datasets.value.push(item)
    }
}

function clearAll() {
    if (!confirm('Delete all?'))
        return
    datasets.value = []
}

function deleteIt(idx: number) {
    if (!confirm('Delete this?'))
        return
    datasets.value.splice(idx, 1)
}

let selected: number

function showAdd() {
    selected = null
    dialog.value.add()
}

function editIt(idx: number) {
    selected = idx
    dialog.value.edit(datasets.value[idx])
}

function loadDefaultSample() {
    if (!confirm('Add default samples?'))
        return
    prefined.forEach(datasetDialogOk)
}

</script>

<template>
    <VAppBar elevation="2" location="bottom" :title="`Dataset (${datasets.length} item)`" density="compact">
        <template v-slot:append>
            <v-btn @click="loadDefaultSample" prependIcon="mdi-database-import">Load Defaults</v-btn>
            <v-btn color="error" @click="clearAll" prependIcon="mdi-delete-sweep">Clear</v-btn>
            <v-btn color="success" @click="showAdd" prependIcon="mdi-image-plus">Add</v-btn>
        </template>
    </VAppBar>
    <DatasetDialog ref="dialog" @dataset="datasetDialogOk" />
    <v-row>
        <v-col v-for="(item, i) in datasets" :key="i" cols="12" sm="3" md="2">
            <v-sheet elevation="1" class="text-center rounded elevated">
                <div class="d-flex ga-1 pa-2">
                    <span class="text-disabled">#{{ i + 1 }}</span>
                    <v-spacer />
                    <VBtn @click="editIt(i)" variant="plain" icon="mdi-pencil" density="compact" size="small"
                        color="warning" />

                    <VBtn @click="deleteIt(i)" variant="plain" icon="mdi-delete" density="compact" size="small"
                        color="error" />
                </div>
                <v-divider />
                <div class="pa-2">
                    <TrafficLight readonly :model-value="item.lights" />
                    <h3>Pressure: {{ item.pressure?.toFixed(1) }} </h3>
                </div>
            </v-sheet>
        </v-col>
    </v-row>
</template>
