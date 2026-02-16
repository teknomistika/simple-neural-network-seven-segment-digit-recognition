import type { Ref } from "vue";

export type MapValue<M> = M extends Map<any, infer V> ? V : never;
export type RefValue<M> = M extends Ref<any, infer V> ? V : never;
// export type RefMapValue<M> = M extends RefValue<MapValue<infer V>> ? V : never;

export type Segment = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g'

export type SegmentScanResult = {
    detected: number | null,
    confidence: string,
    segments: Segment[]
}
export interface Dataset {
    id: number;
    digit: number;
    segments: Segment[]
    createdAt: Date;
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
