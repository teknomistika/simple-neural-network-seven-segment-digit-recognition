<template>
    <svg ref="svg" xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="90" height="160"
        viewBox="-2 -1 14 20">
        <polygon class="a" points="1, 1  2, 0  8, 0  9, 1  8, 2  2, 2" />
        <polygon class="b" points="9, 1 10, 2 10, 8  9, 9  8, 8  8, 2" />
        <polygon class="c" points="9, 9 10,10 10,16  9,17  8,16  8,10" />
        <polygon class="d" points="9,17  8,18  2,18  1,17  2,16  8,16" />
        <polygon class="e" points="1,17  0,16  0,10  1, 9  2,10  2,16" />
        <polygon class="f" points="1, 9  0, 8  0, 2  1, 1  2, 2  2, 8" />
        <polygon class="g" points="1, 9  2, 8  8, 8  9, 9  8,10  2,10" />
        <text class="a" x="4.5" y="1.8">A</text>
        <text class="b" x="8.5" y="5.5">B</text>
        <text class="c" x="8.5" y="13.5">C</text>
        <text class="d" x="4.5" y="17.7">D</text>
        <text class="e" x="0.5" y="13.5">E</text>
        <text class="f" x="0.5" y="5.5">F</text>
        <text class="g" x="4.5" y="9.7">G</text>
    </svg>
</template>

<script setup lang="ts">
import type { Segment } from '@/types';
import { onMounted, shallowRef, watch } from 'vue';

const props = defineProps<{ activeSegements?: Segment[] }>()
const svg = shallowRef<SVGElement>()
function updateSegments(value?: Segment[]) {
    const active = Array.isArray(value) ? value.join(' ') : ''
    svg.value?.setAttribute('class', active)
}

watch(() => props.activeSegements, (v) => {
    updateSegments(v)
})
onMounted(() => updateSegments(props.activeSegements))

</script>

<style lang="scss" scoped>
svg {
    font-family: 'Courier New', Courier, monospace;
    font-size: 1.5pt;
    --color: rgb(var(--v-theme-primary));
    --stroke: rgb(var(--v-theme-surface));
    color: rgb(64, 64, 64);

    text {
        fill: var(--stroke);
        opacity: 0.6;
    }

    polygon {
        stroke: var(--stroke);
        stroke-width: 0.25;
    }

    @each $segment in a, b, c, d, e, f, g {
        &.#{$segment} polygon.#{$segment} {
            fill: var(--color);
        }

        &.#{$segment} text.#{$segment} {
            fill: white;
        }
    }

}
</style>
