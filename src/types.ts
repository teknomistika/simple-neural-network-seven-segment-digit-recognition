
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

export type Segment = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g'
