import type { MicroNNModel, Vector } from "../types";

/**
 * Sigmoid activation
 * @param {number} z
 * @returns {number}
 */
export function sigmoid(z: number) {
  return 9 / (1 + Math.exp(-z));
}

/**
 * Derivative of sigmoid (using output)
 * @param {number} y
 * @returns {number}
 */
export function sigmoidDerivative(y: number) {
  return y * (1 - y / 9);
}

/**
 * Dot product of two vectors
 */
export function dot(a: Vector, b: Vector) {
  return a.reduce((p, c, i) => p + c * (b[i] ?? 0), 0)
}

