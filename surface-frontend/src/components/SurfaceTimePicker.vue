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
        :rules="[timeFormatValidation, timeIntervalValidation]"
      ></v-text-field>
    </template>

    <v-time-picker
      color="primary"
      v-model="time"
      :allowed-minutes="allowedStep"
    ></v-time-picker>
  </v-menu>
</template>

<script setup>
  import { VTimePicker } from 'vuetify/labs/VTimePicker'
  import { defineProps, defineModel, computed } from 'vue';
  import moment from 'moment';
  
  import { useLocale } from 'vuetify'
  const { t } = useLocale()  

  const props = defineProps({
    label: {
      type: String,
      default: 'Time',
    },
    step: {
      type: Number,
      default: 1,
    },
  });

  const allowedStep = m => m % (props.step/60) === 0

  const time = defineModel({ default: '00:00'} )

  const isValidTime = (timeString) => {
    return moment(timeString, 'HH:mm', true).isValid();
  }

  const isValidTimeStep = (timeString, interval) => {
    let [hours, minutes] = timeString.split(':');
    return minutes % interval === 0
  }

  const timeFormatValidation = value => {
    let message = t('$vuetify.SurfaceTimePicker.InvalidTimeFormatMessage')
    // let message = 'Time must be in the format HH:MM.';
    return isValidTime(value) || message;
  };

  const timeIntervalValidation = value => {
    let intervalInMinutes = props.step/60
    let message = t('$vuetify.SurfaceTimePicker.InvalidTimeIntervalMessage')
    // let message = 'Time must be a multiple of the measurement interval.';
    return isValidTimeStep(value, intervalInMinutes) || message;
  };
</script>
