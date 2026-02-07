import type { Segment } from "@/types";
import { addSample, getAllSamples } from "@/utils/samples.util";
import { ref, type Ref } from "vue";

/**
 * Seven-segment image record
 */
export interface DataSetItem {
    id: number;
    digit: number;
    segments: Segment[];
    blob: Blob;
    createdAt: Date;
}

const images = ref<DataSetItem[]>([])
const loading = ref(false)
let sampleLoaded = false

async function loadImages() {
    loading.value = true;
    images.value = await getAllSamples(); // from your IndexedDB helper
    loading.value = false;
    return images.value
}

async function deleteById(id: number) {
    // await deleteImage(digit);
    await loadImages();
}
export function useDatasets() {
    let ready: Promise<DataSetItem[]>
    if (!sampleLoaded) {
        ready = loadImages()
    } else {
        ready = Promise.resolve(images.value)
    }
    return {
        images,
        loading,
        ready,
        loadImages,
        deleteById
    }
}
