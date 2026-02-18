import type { Ref } from "vue";

export type MapValue<M> = M extends Map<any, infer V> ? V : never;
export type RefValue<M> = M extends Ref<any, infer V> ? V : never;
// export type RefMapValue<M> = M extends RefValue<MapValue<infer V>> ? V : never;


export interface Dataset {
    pressure: number;
    lights: Vector
}

export type Vector = Array<number>

export type MicroNNModel = {
    weights: Vector
    bias: number
    learningRate: number
    totalEpochs: number
    createdAt: Date
    updateAt: Date
}
