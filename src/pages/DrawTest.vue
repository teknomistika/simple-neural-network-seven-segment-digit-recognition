<script setup lang="ts">
import { ref } from 'vue';
import SevenSegment from '@/components/SevenSegment.vue';
import Drawer from '@/components/Drawer.vue';
import type { Segment } from '@/types';

const activeSegements = ref<Segment[]>([])
</script>

<template>
  <div style="display: flex;">
    <Drawer @segments="v => activeSegements = v" />
    <SevenSegment :active-segements="activeSegements" />
  </div>
</template>

<style scoped></style>
