<template>
    <VSlider hide-details :min="0" :max="1" :step="0.01" v-model="model">
        <template v-slot:append v-if="!noValue">
            <v-chip label :text="model" style="min-width: 50px;"></v-chip>
            <!-- <v-text-field :step="0.1" :min="0" :max="1" v-model="model" density="compact" style="width: 80px"
                type="number" hide-details variant="outlined" single-line></v-text-field> -->
        </template>
    </VSlider>
</template>
<script setup lang="ts">
defineProps<{ noValue?: boolean }>()
const model = defineModel<number>({ default: 0 })
</script>