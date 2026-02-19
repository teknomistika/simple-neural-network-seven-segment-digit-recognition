<script setup lang="ts">
defineProps<{ value?: number }>()
</script>

<template>
    <span v-if="value > 0" class="ml-1 text-success">+{{
        value.toFixed(3) }}</span>
    <span v-else-if="value < 0" class="ml-1 text-error">{{
        value.toFixed(3) }}</span>
    <span v-else class="ml-1 text-disabled">&mdash;</span>
</template>
