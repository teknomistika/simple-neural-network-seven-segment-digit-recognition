
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

export type Vector = number[]
export type Matrix = number[][]
export type MicroNNModel = {
    weights: Matrix
    bias: Vector
    learningRate: number
    totalEpochs: number
    createdAt: Date
    updateAt: Date
}
