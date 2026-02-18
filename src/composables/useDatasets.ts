import type { Dataset, Vector } from "@/types";
import { ref, watch, type Ref } from "vue";

const STORAGE_KEY = "dataset";

const prefined: Dataset[] = [
    // Red = stop
    { pressure: 0, lights: [1, 0, 0] },
    // Yellow = slow
    { pressure: 0.3, lights: [0, 1, 0] },
    // Green = Go
    { pressure: 1, lights: [0, 0, 1] }
]

const datasets = ref<Dataset[]>((() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
        const storedDatasets = (JSON.parse(raw) as any[])
        storedDatasets.forEach(r => {
            if (typeof r.createdAt == 'string')
                r.createdAt = new Date(r.createdAt)
        })
        return storedDatasets
    } else {
        return [...prefined]
    }
})())

watch(datasets, (changed) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(changed))
}, { deep: true })


export function useDatasets() {
    return {
        datasets,
        prefined
    }
}
