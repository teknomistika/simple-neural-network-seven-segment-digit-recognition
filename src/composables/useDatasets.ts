import type { Dataset, Vector } from "@/types";
import { ref, watch, type Ref } from "vue";

const STORAGE_KEY = "dataset";

const prefined: Omit<Dataset, 'id'>[] = [
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
        return [...prefined].map((v, i) => Object.assign(v, { id: i + 1 }))
    }
})())

watch(datasets, (changed) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(changed))
}, { deep: true })

function del(id: number) {
    const idx = datasets.value.findIndex(v => v.id == id)
    if (idx) {
        datasets.value.splice(idx, 1)
    }
    return datasets
}

function add(pressure: number, lights: Vector) {
    const id = Math.max(0, ...datasets.value.map(v => v.id)) + 1
    const row: Dataset = { id, lights, pressure }
    datasets.value.push(row)
}

export function useDatasets() {
    return {
        datasets,
        add,
        del,
        prefined
    }
}
