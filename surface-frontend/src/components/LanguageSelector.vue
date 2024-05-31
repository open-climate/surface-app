<template>
    <v-select
    variant="outlined"
    prepend-inner-icon="mdi-translate"
    class="position-fixed top-0 right-0 ma-4"
     v-model="$i18n.locale" :items="Object.keys($i18n.messages)"
    ></v-select>
</template>

<script setup>
  import { ref, watch} from 'vue';

	const selecting_language = ref(true)
</script>
