<template>
    <svg ref="svg" class="svg" xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="192" height="320"
        viewBox="-2 -1 14 20">
        <polygon id="a" fill="#eee" points="1, 1  2, 0  8, 0  9, 1  8, 2  2, 2" />
        <polygon id="b" fill="#eee" points="9, 1 10, 2 10, 8  9, 9  8, 8  8, 2" />
        <polygon id="c" fill="#eee" points="9, 9 10,10 10,16  9,17  8,16  8,10" />
        <polygon id="d" fill="#eee" points="9,17  8,18  2,18  1,17  2,16  8,16" />
        <polygon id="e" fill="#eee" points="1,17  0,16  0,10  1, 9  2,10  2,16" />
        <polygon id="f" fill="#eee" points="1, 9  0, 8  0, 2  1, 1  2, 2  2, 8" />
        <polygon id="g" fill="#eee" points="1, 9  2, 8  8, 8  9, 9  8,10  2,10" />
    </svg>
</template>

<script setup lang="ts">
import type { Segment } from '@/types';
import { onMounted, shallowRef, watch } from 'vue';

const props = defineProps<{ activeSegements: Segment[] }>()
const svg = shallowRef<SVGElement>()
function updateSegments(value: Segment[]) {
    const active = Array.isArray(value) ? value.join(' ') : ''
    svg.value?.setAttribute('class', `svg ${active}`)
}

watch(() => props.activeSegements, (v) => {
    updateSegments(v)
})
onMounted(() => updateSegments(props.activeSegements))

</script>

<style lang="css">
svg.svg {
    --color: rgb(49, 194, 126);
    --glow: rgb(65, 255, 135);
    color: var(--color);
}

svg.a #a {
    fill: currentColor;
    filter: drop-shadow(0 0 1px var(--glow))
}

svg.b #b {
    fill: currentColor;
    filter: drop-shadow(0 0 1px var(--glow))
}

svg.c #c {
    fill: currentColor;
    filter: drop-shadow(0 0 1px var(--glow))
}

svg.d #d {
    fill: currentColor;
    filter: drop-shadow(0 0 1px var(--glow))
}

svg.e #e {
    fill: currentColor;
    filter: drop-shadow(0 0 1px var(--glow))
}

svg.f #f {
    fill: currentColor;
    filter: drop-shadow(0 0 1px var(--glow))
}

svg.g #g {
    fill: currentColor;
    filter: drop-shadow(0 0 1px var(--glow))
}
</style>
