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
        :rules="[dateFormatValidation, datePeriodValidation]"
      ></v-text-field>
    </template>

    <v-date-picker
      color="primary"
      v-model="date"
      :allowed-dates="allowedDates"
      :view-mode='viewMode'
    ></v-date-picker>  
  </v-menu>
</template>

<script setup>
  import { ref, watch, defineProps, defineModel, computed } from 'vue';
  import moment from 'moment';

  const props = defineProps({
    label: {
      type: String,
      default: 'Time',
    },
    period: {
      type: String,
      default: 'day',
    },
  });


  const viewMode = computed(() => {
    switch (props.period) {
      case 'month':
        return 'months';
      case 'year':
        return 'year';
      default:
        return 'month';
    }
  });

  const allowedDates = val => {
    const new_date = new Date(val)
    if (props.period === 'year'){
      return new_date.getDate() === 1 && new_date.getMonth() === 0;
    }
    else if (props.period === 'month'){
      return new_date.getDate() === 1;
    }
    return true
  }

  const date = ref(null);
  const formated_date = defineModel({required: true})

  watch(date, () => {
    formatDate(date, formated_date)
  });

  const isValidDate = (dateString) => {
    return moment(dateString, 'YYYY-MM-DD', true).isValid();
  }  

  const isValidDatePeriod = (dateString, period) => {
    if (!isValidDate(dateString)){
      return false
    }

    let date_moment = moment(dateString, 'YYYY-MM-DD')

    if (period === 'year'){
      return (date_moment.format('MM') === '01' && date_moment.format('DD') === '01')
    }
    else if (period === 'month'){
      return (date_moment.format('DD') === '01')
    }
    return true
  }  

  const dateFormatValidation = value => {
    let message  = 'Date must be in the format YYYY-MM-DD.';
    return isValidDate(value) || message;
  };

  const datePeriodValidation = value => {
    let message = 'Unexpected Error'     
    if (props.period === 'year'){
      message = 'Date must be in the format  YYYY-01-01 for Yearly Summary';
    }
    else if (props.period === 'month'){
      message = 'Date must be in the format  YYYY-MM-01 for Monthly Summary';
    }
    return isValidDatePeriod(value, props.period) || message;
  };  

  const updateDate = (fdate, date) => {
    if (isValidDate(fdate)){
      date = moment(fdate, 'YYYY-MM-DD').toDate();  
    }
  };

  const formatDate = (date,fdate) => {
    fdate.value = moment(date.value).format('YYYY-MM-DD')
  };
</script>
