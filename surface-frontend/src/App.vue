<template>
  <v-app>   
    <v-main>
      <Sidebar v-model="sidebar_model"/>
      <LanguageSelector />
      <DataExport v-if="sidebar_model"/>
      <HelloWorld v-if="!sidebar_model"/>
      <AppFooter v-if="!sidebar_model"/>
    </v-main>
  </v-app>
</template>

<script setup>
	import { ref } from 'vue';

	const sidebar_model = ref(false)
</script>
