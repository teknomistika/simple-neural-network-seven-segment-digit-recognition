/**
 * Fixed two digit decimals
 */
export function fixed(n: number, digits = 2) {
    return parseFloat(n.toFixed(digits))
}

/**
 * Random number generator between -1.00 to +1.00
 */
export function random() {
    return fixed(Math.random() * 2 - 1)
}