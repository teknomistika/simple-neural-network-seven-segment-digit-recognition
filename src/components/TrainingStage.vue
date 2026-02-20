<template>
    <k-stage :config="{ width: 800, height: 600 }">
        <k-layer>

            <!-- neuron circle -->
            <k-circle :config="{ x: 150, y: 150, radius: 30, fill: '#fff', stroke: '#000' }" />

            <k-text :config="{ x: 140, y: 145, text: 'Input', fontSize: 14 }" />

            <!-- connection -->
            <k-arrow :config="{
                points: [180, 150, 300, 150],
                stroke: 'gray',
                pointerLength: 10,
                pointerWidth: 10
            }" ref="arrow" />
        </k-layer>
    </k-stage>
</template>

<script setup lang="ts">
import type { Arrow } from 'konva/lib/shapes/Arrow';
import { onMounted, shallowRef } from 'vue';

const arrow = shallowRef<Arrow>()
onMounted(() => {
    console.log(arrow.value)
    // arrow.value?.to({
    //     stroke: 'orange',
    //     strokeWidth: 4,
    //     duration: 0.5,
    //     yoyo: true,
    //     repeat: 1
    // })
})

</script>