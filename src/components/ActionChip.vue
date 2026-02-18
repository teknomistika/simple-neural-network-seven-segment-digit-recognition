<template>
    <VChip label v-bind="props" />
</template>
<script setup lang="ts">
import { Action, getActionCategory, lightColors } from '@/utils/traffic-light.util';
import { computed } from 'vue';

const thisProps = defineProps<{ treshold?: number, action?: number }>()
const props = computed(() => {
    const action = thisProps.action ?? getActionCategory(thisProps.treshold ?? 0)
    return {
        action,
        text: Action[action],
        color: lightColors[action]
    }
})
</script>