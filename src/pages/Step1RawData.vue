<script setup lang="ts">
import { useDatasets } from "@/composables/useDatasets";
import { blobToURL } from "@/utils/data.util";
import { onMounted, ref } from "vue";

const {
    images,
    loading,
    ready,
} = useDatasets();

/**
 * Reference to your drawing canvas
 */
const canvasRef = ref<HTMLCanvasElement | null>(null);
const selectedDigit = ref<number>(0);

function saveFromCanvas() {
    if (!canvasRef.value) return;
    // createOrUpdateFromCanvas(selectedDigit.value, canvasRef.value);
}

ready.then( samples => {
    if( images.value.length > 0 )
        return
    // Load default samples
})

</script>

<template>
    <section>
        <h2>Step 1: Dataset Creation</h2>

        <!-- Canvas -->
        <div>
            <!-- <canvas
        ref="canvasRef"
        width="200"
        height="300"
        style="border: 1px solid #ccc"
      /> -->
        </div>

        <!-- Controls -->
        <div style="margin-top: 8px;">
            <label>
                Digit:
                <select v-model="selectedDigit">
                    <option v-for="n in 10" :key="n - 1" :value="n - 1">
                        {{ n - 1 }}
                    </option>
                </select>
            </label>

            <button @click="saveFromCanvas">
                Save / Replace Image
            </button>
            <VBtn>Add</VBtn>
        </div>

        <!-- Image List -->
        <h3>Stored Images</h3>

        <div v-if="loading">Loading…</div>

        <div v-else class="grid">
            <div v-for="img in images" :key="img.id" class="card">
                <img :src="blobToURL(img.blob)" width="80" />

                <div>Digit: {{ img.digit }}</div>
                <div>Segments: {{ img.segments }}</div>
                <button Xclick="deleteByDigit(img.digit)">
                    Delete
                </button>
            </div>
        </div>
    </section>
</template>

<style scoped>
.grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, 120px);
    gap: 12px;
}

.card {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
}
</style>
