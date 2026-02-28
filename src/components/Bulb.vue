<template>
    <BulbSvg ref="bulb" />
</template>

<script setup lang="ts">
import BulbSvg from './Bulb.svg'

const props = withDefaults(defineProps<{
    color?: number,
    
}>(),{

})


</script>