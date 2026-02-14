import type { Vector, MicroNNModel } from "@/types";
import { reactive, shallowReactive, shallowRef } from "vue";

const inputSize = 7, outputSize = 10

/**
 * Forward pass
 * Returns raw scores (logits)
 */
function predict(input: Vector): Vector {
    return model.value.weights.map((wRow, i) =>
        wRow.reduce((sum, w, j) => sum + w * input[j], model.value.bias[i])
    )
}

function train(scores: Vector, target: Vector, inputs: Vector) {

    // Error = predicted - target
    const errors = scores.map((y, i) => y - target[i])
    const predicted = scores.indexOf(Math.max(...scores))


    // Gradient descent update
    for (let i = 0; i < model.value.weights.length; i++) {
        const layer = model.value.weights[i]
        for (let j = 0; j < layer.length; j++) {
            layer[j] -= model.value.learningRate * errors[i] * inputs[j]
        }
        model.value.bias[i] -= model.value.learningRate * errors[i]
    }

    return { errors, predicted }
}


// HELPER FUNCTIONS
const existing = localStorage.getItem('micro-nn-model')
const randomNumber = () => Math.random() * 2 - 1 // Math.floor(Math.random() * 5) + 1;

const model = shallowRef(existing ?
    JSON.parse(existing) as MicroNNModel :
    createRandomModel())

function createRandomModel() {
    const now = new Date()
    const model: MicroNNModel = {
        learningRate: 0.05,
        weights: Array.from(
            { length: outputSize },
            () => Array.from(
                { length: inputSize },
                randomNumber //Math.random() * 2 - 1
            ),
        ),
        bias: Array.from(
            { length: outputSize },
            randomNumber//() => Math.random() * 2 - 1
        ),
        createdAt: now,
        updateAt: now,
        totalEpochs: 0
    }

    return model
}

function zero() {
    if (!confirm('zero all values?')) return
    const now = new Date()
    model.value = {
        learningRate: 0.05,
        weights: Array.from(
            { length: outputSize },
            () => Array(inputSize).fill(0),
        ),
        bias: Array(outputSize).fill(0),
        createdAt: now,
        updateAt: now,
        totalEpochs: 0,
    }
}

function randomize() {
    if (!confirm('Randomize model?')) return
    model.value = createRandomModel()
}

function useBestModel() {
}


function save() {
    localStorage.setItem('micro-nn-model', JSON.stringify(model))
}

export function useModel() {
    return {
        inputSize, outputSize,
        model,
        save,
        zero,
        randomize,
        train,
        useBestModel,
        predict
    }
}