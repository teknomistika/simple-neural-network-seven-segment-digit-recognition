<script setup lang="ts">
import { useDatasets } from "@/composables/useDatasets";
import { onMounted, ref } from "vue";
import { VCardItem } from "vuetify/components";

const {
    images,
    loading,
    ready,
    loadDefaults,
    clear
} = useDatasets();

/**
 * Reference to your drawing canvas
 */
const canvasRef = ref<HTMLCanvasElement | null>(null);
const selectedDigit = ref<number>(0);
const digits = Array.from({ length: 10 }).map((_, i) => i)

function blobToURL(blob: Blob): string {
    return URL.createObjectURL(blob);
}

function saveFromCanvas() {
    if (!canvasRef.value) return;
    // createOrUpdateFromCanvas(selectedDigit.value, canvasRef.value);
}

ready.then(samples => {
    if (images.value.length > 0)
        return

    if (window['_flag_db_is_just_created']) {
        // Load default samples
        loadDefaults()
    }
})

function clearAll() {
    if (!confirm('Delete all?'))
        return
    clear()
}

function loadDefaultSample() {
    if (!confirm('Load default samples?'))
        return

    loadDefaults()
}

</script>

<template>
    <VAppBar elevation="2" location="bottom" :title="`Dataset (${images.length} item)`" density="compact">
        <template v-slot:append>
            <v-btn @click="loadDefaultSample" prependIcon="mdi-database-import">Load Defaults</v-btn>
            <v-btn color="error" @click="clearAll" prependIcon="mdi-delete-sweep">Clear</v-btn>
            <v-btn color="success" prependIcon="mdi-image-plus">Add</v-btn>
        </template>
    </VAppBar>
    <v-container fluid>
        <VProgressLinear color="primary" absolute v-if="loading" indeterminate />
        <VDialog>
            <VCard title="Add new Image">
                <VCardItem>
                    <!-- Canvas -->
                    <div>
                        <!-- <canvas
                    ref="canvasRef"
                    width="200"
                    height="300"
                    style="border: 1px solid #ccc"
                  /> -->
                    </div>
                </VCardItem>
                <VCardActions>
                    <VBtn>Add</VBtn>
                </VCardActions>
            </VCard>
        </VDialog>
        <v-row>
            <v-col v-for="(img, i) in images" :key="img.id" cols="12" sm="6" md="4" lg="3">
                <v-sheet elevation="1">
                    <div class="d-flex flex-row">
                        <v-img :src="blobToURL(img.blob)" :minWidth="90" style="flex:none" aspectRatio="9 / 16"></v-img>
                        <div style="flex: auto;" class="pa-3">
                            <VBtn 
                            style="float: right;"
                            variant="plain" icon="mdi-delete" density="compact" color="error"/>
                            <h3>
                                Digit: {{ img.detected }}
                            </h3>
                            <div class="d-flex ga-1">
                                <VChip size="small" variant="flat" density="comfortable" label color="primary"
                                    v-for="item in img.segments" :key="item" v-text="item" />
                            </div>
                        </div>
                    </div>


                    <!-- <v-table class="text-caption" density="compact">
                        <tbody>
                            <tr align="right">
                                <th>Digit:</th>

                                <td>{{ img.detected }}</td>
                            </tr>
                        </tbody>
                    </v-table> -->
                </v-sheet>
            </v-col>
        </v-row>
    </v-container>
</template>
