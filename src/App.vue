<script setup lang="ts">
import { onBeforeUnmount, onBeforeUpdate, ref } from 'vue';
import SevenSegment from './components/SevenSegment.vue';
import Drawer from './components/Drawer.vue';
const disp = ref<number | null>(0)

// const i = setInterval(() => {
//   if (disp.value == 9) disp.value = 0
//   else disp.value++
// }, 1000);

// onBeforeUnmount(() => {
//   clearInterval(i)
// })

</script>

<template>
  <div style="display: flex;">
    <Drawer />
    <SevenSegment :value="disp" />
  </div>
</template>

<style scoped></style>
