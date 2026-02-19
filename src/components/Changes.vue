<script setup lang="ts">
defineProps<{ value?: number }>()
</script>
<template>
    <span v-if="value > 0" class="ml-1 text-success">
        +<slot><code>{{ value.toFixed(3) }}</code></slot>
    </span>
    <span v-else-if="value < 0" class="ml-1 text-error">
        <slot><code>{{ value.toFixed(3) }}</code></slot>
    </span>
    <span v-else class="ml-1 text-disabled">
        <slot>&mdash;</slot>
    </span>
</template>
