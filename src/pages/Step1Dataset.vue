<script setup lang="ts">
import Drawer from "@/components/Drawer.vue";
import SevenSegment from "@/components/SevenSegment.vue";
import { useDatasets } from "@/composables/useDatasets";
import { onMounted, ref } from "vue";
import { VCardItem } from "vuetify/components";

const {
    images,
    loading,
    ready,
    loadDefaults,
    clear,
    deleteById
} = useDatasets();

function blobToURL(blob: Blob): string {
    return URL.createObjectURL(blob);
}

ready.then(_ => {
    if (images.value.length > 0)
        return

    // Load default samples
    if (window['_flag_db_is_just_created']) {
        loadDefaults()
    }
})

function clearAll() {
    if (!confirm('Delete all?'))
        return
    clear()
}

function deleteIt(id: number) {
    if (!confirm('Delete this?'))
        return
    deleteById(id)
}

function loadDefaultSample() {
    if (!confirm('Load default samples?'))
        return

    loadDefaults()
}

const dialog = ref(false)

</script>

<template>
    <VAppBar elevation="2" location="bottom" :title="`Dataset (${images.length} item)`" density="compact">
        <template v-slot:append>
            <v-btn @click="loadDefaultSample" prependIcon="mdi-database-import">Load Defaults</v-btn>
            <v-btn color="error" @click="clearAll" prependIcon="mdi-delete-sweep">Clear</v-btn>
            <v-btn color="success" @click="dialog = true" prependIcon="mdi-image-plus">Add</v-btn>
        </template>
    </VAppBar>
    <v-container fluid>
        <VProgressLinear color="primary" absolute v-if="loading" indeterminate />
        <VDialog v-model="dialog">
            <VCard title="Add new Image">
                <VCardItem>
                    <Drawer/>
                </VCardItem>
                <VCardActions>
                    <VBtn>Add</VBtn>
                </VCardActions>
            </VCard>
        </VDialog>
        <v-row>
            <v-col v-for="(img, i) in images" :key="img.id" cols="12" sm="3" md="2">
                <v-sheet elevation="1" class="pa-3 text-center">
                    <VBtn @click="deleteIt(img.id)" style="float: right;" variant="plain" icon="mdi-delete"
                        density="compact" color="error" />
                    <h3>Digit: {{ img.detected }} </h3>
                    <!-- <div class="d-flex ga-1">
                            <VChip size="small" variant="flat" density="comfortable" label color="primary"
                                v-for="item in img.segments" :key="item" v-text="item" />
                        </div> -->
                    <VImg>
                        <SevenSegment :active-segements="img.segments" />
                    </VImg>
                </v-sheet>
            </v-col>
        </v-row>
    </v-container>
</template>
