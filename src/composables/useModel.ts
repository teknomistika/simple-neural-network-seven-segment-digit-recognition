import type { MicroNNModel, Vector } from "@/types";
import { dot, sigmoid } from "@/utils/math.util";
import { reactive, shallowRef, type ShallowRef } from "vue";

const existing = localStorage.getItem('micro-nn-model')
const model = reactive(
    existing ?
        JSON.parse(existing) as MicroNNModel :
        createRandomModel()
)

function createRandomModel(inputSize = 7) {
    const now = new Date()
    const model: MicroNNModel = {
        learningRate: 0.1,
        weights: Array.from({ length: inputSize }, () => Math.random() * 2 - 1),
        bias: Math.random() * 2 - 1,
        createdAt: now,
        updateAt: now,
        totalEpochs: 0
    }

    return model
}

function predict(x: Vector) {
    const z = dot(model.weights, x) + model.bias;
    return sigmoid(z) * 10;
}

function save() {
    localStorage.setItem('micro-nn-model', JSON.stringify(model))
}

export function useModel() {
    return {
        model,
        save,
        createRandomModel,
        predict
    }
}