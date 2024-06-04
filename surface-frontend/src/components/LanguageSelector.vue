<template>
  <v-select
  variant="outlined"
  prepend-inner-icon="mdi-translate"
  class="position-fixed top-0 right-0 ma-4"
  v-model="current"
  :items="Object.keys(messages)"
  ></v-select>
</template>

<script setup>
  import { ref, watch, onMounted } from 'vue';

  import { useLocale } from 'vuetify'
  
  const { messages } = useLocale()
  const { current } = useLocale()

  onMounted( async () => {
    let browserLanguage = navigator.languages ? navigator.languages[0] : (
      navigator.language || navigator.userLanguage
    );

    browserLanguage = browserLanguage.split('-')[0];

    if (!Object.keys(messages.value).includes(browserLanguage)) {
      browserLanguage = 'en';
    }

    current.value = browserLanguage;
  });  

</script>
