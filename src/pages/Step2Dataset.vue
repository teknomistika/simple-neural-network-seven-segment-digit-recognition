<script setup lang="ts">
import Drawer from "@/components/Drawer.vue";
import SevenSegment from "@/components/SevenSegment.vue";
import { useDatasets } from "@/composables/useDatasets";
import type { Segment } from "@/types";
import { SEVEN_SEGMENT_DIGIT_MAPS } from "@/utils/seven-segment.util";
import { ref } from "vue";


const {
    datasets,
    del,
    add
} = useDatasets();

function onSegments(digit: number, segments: Segment[]) {
    add(digit, segments)
    dialog.value = false
}


function addPrefined() {
    SEVEN_SEGMENT_DIGIT_MAPS.forEach(
        (segments, digit) => add(digit, segments)
    )
}

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
    addPrefined()
}
// Load default samples
if (window['_flag_db_is_just_created']) {
    addPrefined()
}

const dialog = ref(false)

</script>

<template>
    <VAppBar elevation="2" location="bottom" :title="`Dataset (${datasets.length} item)`" density="compact">
        <template v-slot:append>
            <v-btn @click="loadDefaultSample" prependIcon="mdi-database-import">Load Defaults</v-btn>
            <v-btn color="error" @click="clearAll" prependIcon="mdi-delete-sweep">Clear</v-btn>
            <v-btn color="success" @click="dialog = true" prependIcon="mdi-image-plus">Add</v-btn>
        </template>
    </VAppBar>

    <VDialog v-model="dialog" :maxWidth="600">
        <Drawer @segments="onSegments" />
    </VDialog>
    <v-row>
        <v-col v-for="(img, i) in datasets" :key="img.id" cols="12" sm="3" md="2">
            <v-sheet elevation="1" class="pa-3 text-center">
                <VBtn @click="deleteIt(img.id)" style="float: right;" variant="plain" icon="mdi-delete"
                    density="compact" color="error" />
                <h3>Digit: {{ img.digit }} </h3>
                <VImg>
                    <SevenSegment :active-segements="img.segments" />
                </VImg>
            </v-sheet>
        </v-col>
    </v-row>
</template>
