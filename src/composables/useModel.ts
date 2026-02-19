import type { MicroNNModel, Vector } from "@/types";
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

function createRandomModel() {
    const now = new Date()
    const model: MicroNNModel = {
        learningRate: 0.1,
        weights: Array.from({ length: inputSize }, () => Math.random() * 2 - 1),
        bias: 0,
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

function train(yPred: number, lights: Vector) {

    const Y = predict(lights)
    // MSE (Mean Squared Error)
    latestLoss.value = 0.5 * (yPred - Y) ** 2
    // derivative of MSE 
    const error = Y - yPred;

    const adjustment = model.learningRate * error

    for (let i = 0; i < model.weights.length; i++) {
        // Track changes
        weightChanges.value[i] = adjustment * lights[i];
        // Update weight / connection
        model.weights[i] -= weightChanges.value[i]
    }

    // Track bias changes
    biasChanges.value = adjustment
    // Update bias
    model.bias -= adjustment;

    model.totalEpochs++
    return { output: Y, error, adjustment }
}

function save() {
    localStorage.setItem('micro-nn-model', JSON.stringify(model))
}

export function useModel() {
    return {
        model,
        save,
        zero,
        randomize,
        train,
        weightChanges,
        biasChanges,
        predict,
        inputSize,
        latestLoss
    }
}