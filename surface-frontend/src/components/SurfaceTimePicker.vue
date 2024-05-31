<template>
  <v-menu
    location="end"
    transition="scale-transition"
    :close-on-content-click="false"        
  >
      <template v-slot:activator="{ props }">
        <v-text-field
          v-bind="props"
          :label="label"
          v-model="time"
          prepend-inner-icon="mdi-clock"
        ></v-text-field>
      </template>

      <v-time-picker
        color="primary"
        v-model="time"
      ></v-time-picker>
  </v-menu>
</template>

<script setup>
  import { VTimePicker } from 'vuetify/labs/VTimePicker'
  import { defineProps,defineModel } from 'vue';

  const props = defineProps({
    label: String, // Define label prop of type String
  });

  const time = defineModel({ default: '00:00'} )
</script>
