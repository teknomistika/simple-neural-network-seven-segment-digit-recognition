
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

/**
 * Training sample
*/
export type Sample = {
    /**
     * Seven segment input
    */
    x: Vector
    /**
     * Target output (digit / 10)
    */
    y: number
}

export type MicroNNModel = {
    weights: Vector
    bias: number
    learningRate: number
    lastUpdate: Date
}
