<script setup lang="ts">
import DatasetDialog from "@/components/DatasetDialog.vue";
import TrafficLight from "@/components/TrafficLight.vue";
import { useDatasets } from "@/composables/useDatasets";
import type { Vector } from "@/types";
import { ref } from "vue";

const {
    datasets,
    del,
    add,
    prefined
} = useDatasets();


function clearAll() {
    if (!confirm('Delete all?'))
        return
    datasets.value = []
}

function deleteIt(id: number) {
    if (!confirm('Delete this?'))
        return
    del(id)
}

function loadDefaultSample() {
    if (!confirm('Add default samples?'))
        return
    prefined.forEach(v => add(v.pressure, v.lights))
}



</script>

<template>
    <VAppBar elevation="2" location="bottom" :title="`Dataset (${datasets.length} item)`" density="compact">
        <template v-slot:append>
            <v-btn @click="loadDefaultSample" prependIcon="mdi-database-import">Load Defaults</v-btn>
            <v-btn color="error" @click="clearAll" prependIcon="mdi-delete-sweep">Clear</v-btn>
            <DatasetDialog>
                <template #default="{ props }">
                    <v-btn color="success" v-bind="props" prependIcon="mdi-image-plus">Add</v-btn>
                </template>
            </DatasetDialog>
        </template>
    </VAppBar>

    <v-row>
        <v-col v-for="(item, i) in datasets" :key="item.id" cols="12" sm="3" md="2">
            <v-sheet elevation="1" class="pa-3 text-center">
                <VBtn @click="deleteIt(item.id)" style="float: right;" variant="plain" icon="mdi-delete"
                    density="compact" color="error" />
                <h3>Pressure: {{ item.pressure?.toFixed(1) }} </h3>
                <TrafficLight readonly :model-value="item.lights" />
            </v-sheet>
        </v-col>
    </v-row>
</template>
