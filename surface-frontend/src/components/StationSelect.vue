<template>
  <form>
    <h6>Station Select</h6>
    <v-row class="mx-3" dense justify="start">
      <v-col cols="6">
        <v-autocomplete
          v-model="selected.station"
          label="Select"
          :items="stationList"
          :item-title="getStationTitle"
          item-value="id"
          multiple
          chips
          closable-chips
        ></v-autocomplete>
      </v-col>      
    </v-row>
    <v-row class="mx-3" dense justify="start">
      <h3>{{selected.station}}</h3>
    </v-row>
  </form>
</template>

<script setup>
  import { ref, watch, computed, onMounted } from 'vue';
  import axios from 'axios';

  const BASE_URL  = import.meta.env.VITE_BACKEND_BASE_URL 

  // const response = await axios.get(BASE_URL +'/api/stations/?format=json', {
  //   headers: {
  //     'Authorization': `Token ${import.meta.env.VITE_BACKEND_TOKEN}`
  //   }
  // });
  let stationList = ref([])

  onMounted( async () => {
    await axios.get(BASE_URL +'/api/stations/?format=json', {
      headers: {
        'Authorization': `Token ${import.meta.env.VITE_BACKEND_TOKEN}`
      }
    }).then((response) => {
      console.log(response.data.results)
      stationList.value = response.data.results
    });
  });


  const getStationTitle = (station) => {
    return `${station.name} - ${station.code}`;
  }

  const selected = ref({
      station: null,
  });
</script>

<style scoped>
</style>

