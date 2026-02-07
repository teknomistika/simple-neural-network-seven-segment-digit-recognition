<template>
    <div>
        <div v-for="value in samples">
            <ImageDetector :src="value"/>
        </div>
    </div>
</template>

<script setup lang="ts">
import ImageDetector from '@/components/ImageDetector.vue';
import { loadSamples } from '@/utils/samples.util';


const samples = loadSamples()

</script>