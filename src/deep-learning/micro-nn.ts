import { dot, sigmoid, sigmoidDerivative } from "./helpers";
import type { Vector } from "./types";

/**
 * Neural Network (1 neuron as output)
*/
export default class MicroNN {
    weights: Vector = []
    bias: number = 0
    learningRate: number = 0.1

    get inputSize() {
        return this.weights.length
    }

    loadRandom(inputSize = 7) {
        this.weights = Array.from({ length: inputSize }, () => Math.random() * 2 - 1);
        this.bias = Math.random() * 2 - 1;
    }

    import(jsonStr: string) {
        const { weights, bias } = JSON.parse(jsonStr)
        if (!weights?.length) throw new Error('Invalid weights')
        this.weights = weights
        this.bias = bias ?? 0
    }

    export() {
        return JSON.stringify({
            weights: this.weights,
            bias: this.bias
        })
    }

    /**
     * Forward pass
     */
    predict(x: Vector) {
        const z = dot(this.weights, x) + this.bias;
        return sigmoid(z);
    }

    /**
     * Train on one sample
     * @param {Vector} x 
     * @param {number} yTrue
     */
    trainSample(x: Vector, yTrue: number) {
        const yPred = this.predict(x);

        // Mean Squared Error derivative
        const error = yPred - yTrue;

        // Backprop (chain rule)
        const dSigmoid = sigmoidDerivative(yPred);
        const gradient = error * dSigmoid;

        // Update weights
        for (let i = 0; i < this.weights.length; i++) {
            this.weights[i] -= this.learningRate * gradient * x[i];
        }

        // Update bias
        this.bias -= this.learningRate * gradient;
    }

    /**
     * Train for multiple epochs
     * @param {Sample[]} dataset
     * @param {number} epochs
     */
    train(dataset, epochs = 5000) {
        for (let e = 0; e < epochs; e++) {
            for (const sample of dataset) {
                this.trainSample(sample.x, sample.y);
            }
        }
    }
}