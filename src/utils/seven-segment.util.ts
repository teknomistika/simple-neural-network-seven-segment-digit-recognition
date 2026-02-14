import type { Segment, SegmentScanResult, Vector } from "@/types";

/**
 * Digit to segment mapping (which segments are ON for each digit).
 * Seven Segment Display Layout 4X7 pixels:
 *          01234 
 *       0   AAA   0
 *       1  F   B  1
 *       2  F   B  2
 *       3   GGG   3
 *       4  E   C  4
 *       5  E   C  5
 *       6   DDD   6
 *          01234
 */
export const SEVEN_SEGMENT_DIGIT_MAPS: Segment[][] = [
    /* 0 */['a', 'b', 'c', 'd', 'e', 'f'],
    /* 1 */['b', 'c'],
    /* 2 */['a', 'b', 'd', 'e', 'g'],
    /* 3 */['a', 'b', 'c', 'd', 'g'],
    /* 4 */['b', 'c', 'f', 'g'],
    /* 5 */['a', 'c', 'd', 'f', 'g'],
    /* 6 */['a', 'c', 'd', 'e', 'f', 'g'],
    /* 7 */['a', 'b', 'c'],
    /* 8 */['a', 'b', 'c', 'd', 'e', 'f', 'g'],
    /* 9 */['a', 'b', 'c', 'd', 'f', 'g']
]

/**
 * Segment location mapping
 */
const SEVEN_SEGMENT_LOCATIONS: Map<Segment, { x1: number, y1: number, x2: number, y2: number }> = new Map([
    ['a', { x1: 1, y1: 0, x2: 4, y2: 2 }],  // top horizontal
    ['b', { x1: 2, y1: 1, x2: 4, y2: 3 }],  // top right vertical
    ['c', { x1: 2, y1: 4, x2: 4, y2: 7 }],  // bottom right vertical
    ['d', { x1: 1, y1: 5, x2: 4, y2: 7 }],  // bottom horizontal
    ['e', { x1: 0, y1: 4, x2: 2, y2: 7 }],  // bottom left vertical
    ['f', { x1: 0, y1: 0, x2: 2, y2: 3 }],  // top left vertical
    ['g', { x1: 1, y1: 3, x2: 3, y2: 5 }],   // middle horizontal
])

export const SEVEN_SEGMENT_CHARSET: Segment[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g']

export function scanSevenSegmentOnCanvas(ctx: CanvasRenderingContext2D, width: number, height: number): SegmentScanResult {
    const imageData = ctx.getImageData(0, 0, width, height, {});

    const scaled = [];
    const scaledWidth = 4
    const scaledHeight = 7

    // Calculate the size of each pooling region
    const scaleX = width / scaledWidth;
    const scaleY = height / scaledHeight;

    for (let outY = 0; outY < scaledHeight; outY++) {
        scaled[outY] = [];
        for (let outX = 0; outX < scaledWidth; outX++) {
            // Define the region in input array to average
            const startX = Math.floor(outX * scaleX);
            const endX = Math.floor((outX + 1) * scaleX);
            const startY = Math.floor(outY * scaleY);
            const endY = Math.floor((outY + 1) * scaleY);
            let sum = 0;
            let count = 0;

            // Average all values in this region
            for (let y = startY; y < endY; y++) {
                for (let x = startX; x < endX; x++) {
                    const i = (y * width + x) * 4;
                    const r = imageData.data[i];
                    const g = imageData.data[i + 1];
                    const b = imageData.data[i + 2];

                    // Convert to grayscale (0 = white, 255 = black)
                    const grayscale = 255 - (0.299 * r + 0.587 * g + 0.114 * b);
                    sum += grayscale;
                    count++;
                }
            }

            scaled[outY][outX] = count > 0 ? sum / count : 0;
        }
    }

    const threshold = 80; // Minimum average darkness to consider segment "filled"
    // console.log(scaled)
    // console.log(scaled.map(v => v.map(v => v > threshold ? 'X' : ' ')).join('\n'))

    // Analyze each segment
    const filled = new Set<Segment>()

    for (const [segmentName, coords] of SEVEN_SEGMENT_LOCATIONS.entries()) {
        const { x1, y1, x2, y2 } = coords

        let sum = 0;
        let count = 0;

        // Sample pixels in this region
        for (let y = y1; y < y2; y++) {
            for (let x = x1; x < x2; x++) {
                sum += scaled[y][x];
                count++;
            }
        }

        const average = count > 0 ? sum / count : 0;
        if (average > threshold) {
            filled.add(segmentName)
        }
    }

    const segments = [...filled.values()]
    return {
        segments,
        ...guestDigitFromSegments(segments)
    }
}

const DIGIT_SEGMENTS_SCANS = SEVEN_SEGMENT_DIGIT_MAPS.map(
    (segments, digit) => ({ digit, segments })
)

// Add additional for "1"
DIGIT_SEGMENTS_SCANS.push(
    { digit: 1, segments: ['e', 'f'] },
    { digit: 1, segments: ['c', 'f', 'g'] },
    { digit: 1, segments: ['b', 'e', 'g'] },
    { digit: 1, segments: ['c', 'f'] },
    { digit: 1, segments: ['b', 'e'] },
    { digit: 1, segments: ['g'] }
)

/**
 * Determine which digit it might be, without using machine-learning.
 */
function guestDigitFromSegments(segments: Segment[]) {

    const filledSegments = segments.sort();
    let bestMatch: number = null;
    let bestScore = 0;

    for (const { digit, segments } of DIGIT_SEGMENTS_SCANS) {
        const expectedSegments = segments.sort();
        const matches = filledSegments.filter(s => expectedSegments.includes(s)).length;
        const total = Math.max(filledSegments.length, expectedSegments.length);
        const score = total > 0 ? matches / total : 0;

        if (score > bestScore) {
            bestScore = score;
            bestMatch = digit;
        }
    }

    return {
        detected: bestMatch,
        confidence: (bestScore * 100).toFixed(1)
    };
}
