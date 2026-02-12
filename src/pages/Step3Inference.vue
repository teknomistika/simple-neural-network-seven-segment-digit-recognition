<template>
    <VAppBar key="step3-appbar" elevation="2" location="bottom" :title="`Inference`" density="compact">
        <!-- <template v-slot:append>
            <v-btn prependIcon="mdi-database-import">Load Defaults</v-btn>
            <v-btn color="error" prependIcon="mdi-delete-sweep">Clear</v-btn>
            <v-btn color="success" prependIcon="mdi-image-plus">Add</v-btn>
        </template> -->
    </VAppBar>
    <v-container fluid>
        <VProgressLinear color="primary" absolute v-if="loading" indeterminate />

        <v-row>
            <v-col>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
// https://codesandbox.io/p/sandbox/flamboyant-hypatia-k6dnp7

const loading = ref(false)

</script>