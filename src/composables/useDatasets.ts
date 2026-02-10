import type { Dataset, Segment } from "@/types";
import { addSample, clearSamples, deleteSample, getAllSamples, importPredefined } from "@/utils/dataset.util";
import { ref, type Ref } from "vue";

/**
 * Seven-segment image record
 */

const images = ref<Dataset[]>([])
const loading = ref(false)
let sampleLoaded = false

async function loadImages() {
    loading.value = true;
    images.value = await getAllSamples(); // from your IndexedDB helper
    loading.value = false;
    return images.value
}

async function loadDefaults() {
    loading.value = true
    images.value = await importPredefined()
    loading.value = false
}

async function clear() {
    loading.value = true
    await clearSamples()
    images.value = []
    loading.value = false
}

async function deleteById(id: number) {
    loading.value = true
    images.value = await deleteSample(id)
    loading.value = false
}

async function addSampleSegments(digit: number, segments: Segment[]) {
    loading.value = true
    const newRecord = await addSample({
        createdAt: new Date(),
        segments,
        digit
    })
    images.value = [...images.value, newRecord]
    loading.value = false
}

export function useDatasets() {
    let ready: Promise<Dataset[]>
    if (!sampleLoaded) {
        sampleLoaded = true
        ready = loadImages()
    } else {
        ready = Promise.resolve(images.value)
    }
    return {
        images,
        loading,
        ready,
        clear,
        loadImages,
        loadDefaults,
        addSampleSegments,
        deleteById
    }
}
