<template>
  <v-menu
    location="end"
    transition="scale-transition"
    :close-on-content-click="false"
  >
    <template v-slot:activator="{ props }">
      <v-text-field
        v-bind="props"
        v-model="formated_date"
        :label="label"
        prepend-inner-icon="mdi-calendar"
        @input="updateDate(formated_date, date)"
      ></v-text-field>
    </template>

    <v-date-picker
      color="primary"
      v-model="date"
    ></v-date-picker>  
  </v-menu>
</template>

<script setup>
  import { ref, watch, defineProps, defineModel } from 'vue';
  import moment from 'moment';

  const props = defineProps({
    label: String, // Define label prop of type String
  });

  const date = ref(null);
  const formated_date = defineModel({required: true})

  watch(date, () => {
    formatDate(date, formated_date)
  });

  const updateDate = (fdate, date) => {
    date.value = moment(fdate.value, 'YYYY-MM-DD').toDate();
  };

  const formatDate = (date,fdate) => {
    fdate.value = moment(date.value).format('YYYY-MM-DD')
  };


</script>
