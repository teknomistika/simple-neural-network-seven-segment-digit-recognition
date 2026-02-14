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

function setModel(newModel: Partial<MicroNNModel>) {
    model.weights = newModel.weights ?? model.weights
    model.bias = newModel.bias ?? model.bias
    model.createdAt = newModel.createdAt ?? model.createdAt
    model.updateAt = newModel.updateAt ?? model.updateAt
    model.totalEpochs = newModel.totalEpochs ?? model.totalEpochs
    model.learningRate = model.learningRate ?? newModel.learningRate
}

function useBestModel() {

    /*
        0: 0.6084789914492688
        1: 0.0007411852013835818
        2: 0.00012709346365588625
        3: -0.00024358835535953638
        4: -0.00016165010766983068
        5: 0.0342736691040042
        6: -0.03578267762226095
        7: -0.00008417394282367319
        8: 0.053626379549098324
        9: -0.09472177407986238
    */
    setModel({
        "learningRate": 0.048960508130678974,
        "weights": [
            2.0004306740117825,
            0.44211855120097593,
            0.47405203806441754,
            -1.2549670125424288,
            0.06007098295387228,
            1.0443029306882907,
            0.3640731913292171
        ],
        "bias": -5.504749673446708,
        "createdAt": new Date("2026-02-13T01:37:09.863Z"),
        "updateAt": new Date("2026-02-13T01:37:09.863Z"),
        "totalEpochs": 195890
    })
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
    // Addition
    // const z = x.reduce((p, c, i) => p + c + model.weights[i], model.bias)
    const z = dot(model.weights, x) + model.bias;
    // Identity (linear) activation
    return Math.tanh(z)
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
        useBestModel,
        predict
    }
}