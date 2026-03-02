import type { MicroNNModel, Vector } from "@/types";
import { random } from "@/utils/helper.util";
import { reactive, ref } from "vue";

const inputSize = 3
const existing = localStorage.getItem('micro-nn-model')
const model = reactive(
    existing ?
        JSON.parse(existing) as MicroNNModel :
        createRandomModel()
)

const weightChanges = ref(model.weights.map(_ => 0))
const biasChanges = ref(NaN)
const latestLoss = ref(NaN)

function save() {
    localStorage.setItem('micro-nn-model', JSON.stringify(model))
}

function createRandomModel() {
    const now = new Date()
    const model: MicroNNModel = {
        learningRate: 0.5,
        weights: Array.from({ length: inputSize }, random),
        bias: random(),
        createdAt: now,
        updateAt: now,
        totalEpochs: 0
    }

    return model
}

function setModel(newModel: Partial<MicroNNModel>) {
    model.weights = newModel.weights ?? model.weights
    model.bias = newModel.bias ?? model.bias
    model.createdAt = newModel.createdAt ?? model.createdAt
    model.updateAt = newModel.updateAt ?? model.updateAt
    model.totalEpochs = newModel.totalEpochs ?? model.totalEpochs
    model.learningRate = model.learningRate ?? newModel.learningRate
}

function randomize() {
    if (!confirm('Randomize model?')) return
    setModel(createRandomModel())
}

function zero() {
    if (!confirm('zero all values?')) return
    const now = new Date()
    setModel({
        weights: model.weights.map(v => 0),
        bias: 0,
        createdAt: now,
        updateAt: now,
        totalEpochs: 0,
    })
}

function predict(x: Vector) {
    // Dot product of two vectors
    const z = model.weights.reduce((p, c, i) => p + c * x[i], 0) + model.bias

    // Identity (linear) activation / no modifications
    return z
}

export const useModel = () => ({
    model,
    save,
    zero,
    randomize,
    weightChanges,
    biasChanges,
    predict,
    inputSize,
    latestLoss
})