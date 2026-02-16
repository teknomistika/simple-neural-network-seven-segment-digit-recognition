import type { Dataset, Segment } from "@/types";
import { ref, watch, type Ref } from "vue";

const STORAGE_KEY = "dataset";
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
        window['_flag_db_is_just_created'] = 1
        return []
    }
})())

watch(datasets, (changed) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(changed.map(v => ({
        ...v,
        createdAt: v.createdAt.toString(),
    }))))
}, { deep: true })

function del(id: number) {
    const idx = datasets.value.findIndex(v => v.id == id)
    if (idx) {
        datasets.value.splice(idx, 1)
    }
    return datasets
}

function add(digit: number, segments: Segment[]) {
    const id = Math.max(0, ...datasets.value.map(v => v.id)) + 1
    const row: Dataset = {
        id,
        createdAt: new Date(),
        segments,
        digit
    }
    datasets.value.push(row)
}

export function useDatasets() {
    return {
        datasets,
        add,
        del
    }
}
