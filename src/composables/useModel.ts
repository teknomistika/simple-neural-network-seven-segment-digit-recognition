import type { MicroNNModel } from "@/types";
import { shallowRef, type ShallowRef } from "vue";

const existing = localStorage.getItem('micro-nn-model')
const model = existing ? shallowRef(JSON.parse(existing) as MicroNNModel) : shallowRef(createRandomModel())

function createRandomModel(inputSize = 7) {
    const model: MicroNNModel = {
        lastUpdate: new Date(),
        learningRate: 0.1,
        weights: Array.from({ length: inputSize }, () => Math.random() * 2 - 1),
        bias: Math.random() * 2 - 1,
    }

    return model
}

function save() {
    localStorage.setItem('micro-nn-model', JSON.stringify(model.value))
}

export function useModel() {
    return {
        model,
        save
    }
}