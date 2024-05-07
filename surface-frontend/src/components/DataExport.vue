<template>
  <form>
    <h6>Station Filters</h6>
    <v-row class="mx-3" dense justify="start">
      <v-col class="text-center" cols="2">
        <v-switch
            v-model="filter.byDistrict"
            color="primary"
            label="Filter by district"
            @change="clearDistrict(filter, selected)"
        ></v-switch> 
      </v-col>      
      <v-col class="text-center" cols="3">
        <v-autocomplete
          item-title="name"
          item-value="name"
          v-model="selected.district"
          :items="stationDistrictList"
          label="District"
          clearable
          :disabled="!filter.byDistrict"
        ></v-autocomplete>
      </v-col>
      <v-col class="text-center" cols="3">
        <v-autocomplete
          item-title="name"
          item-value="name"
          v-model="selected.watershed"
          :items="stationWatershedList"
          label="Watershed"
          clearable
          :disabled="filter.byDistrict"
        ></v-autocomplete>
      </v-col> 
      <v-col class="text-center" cols="4">
        <v-autocomplete
          item-title="name"
          item-value="name"
          v-model="selected.profile"
          :items="stationProfileList"
          label="Profile"
          clearable
        ></v-autocomplete>
      </v-col>       
    </v-row>
    <v-row class="mx-3" dense justify="start">
      <v-col class="text-center" cols="2">
        <v-switch
          v-model="filter.isActive"
          color="primary"
          label="Active"
        ></v-switch>              
      </v-col>
      <v-col class="center" cols="2">
        <v-switch
          v-model="filter.isAutomatic"
          color="primary"
          label="Automatic"
        ></v-switch>
      </v-col>
      <v-col  class="text-center"  cols="4">
        <v-autocomplete
          v-model="selected.station"
          label="Station"
          :items="stationList"
          :item-title="getStationTitle"
          item-value="id"
          clearable
        ></v-autocomplete>
      </v-col>     
      <v-col cols="4">
        <v-autocomplete
          v-model="selected.variable"
          label="Variable"
          :items="variableList"
          item-title="name"
          item-value="id"
          clearable
        ></v-autocomplete>
      </v-col>           
    </v-row>

    <hr>

    <v-row class="mx-3 mt-3" dense justify="start">
      <v-col class="text-center" cols="4">
        <v-select
          v-model="selected.source"
          item-title="text"                
          :items="data_sources"
          label="Data Source"
          return-object
        ></v-select>
      </v-col>      
      <v-col  class="text-center"  cols="4">
        <v-menu
          location="end"
          transition="scale-transition"
          :close-on-content-click="false"
        >
            <template v-slot:activator="{ props }">
              <v-text-field
                v-bind="props"
                v-model="finitial_date"
                label="Initial date"
                prepend-icon="mdi-calendar"
                @input="updateDate(finitial_date, initial_date)"
              ></v-text-field>
            </template>

            <v-date-picker
              color="primary"
              v-model="initial_date"
            ></v-date-picker>  
        </v-menu>
      </v-col>
      <v-col cols="4">
        <v-menu
          location="end"
          transition="scale-transition"
          :close-on-content-click="false"
        >
          <template v-slot:activator="{ props }">
            <v-text-field
              v-bind="props"
              v-model="ffinal_date"
              label="Final date"
              prepend-icon="mdi-calendar"
              @input="updateDate(ffinal_date, final_date)"
            ></v-text-field>
          </template>

          <v-date-picker
            color="primary"
            v-model="final_date"
          ></v-date-picker>  
        </v-menu>
      </v-col>         
    </v-row>

    <v-row class="mx-3" dense justify="start">
      <v-col class="text-center"  cols="4">
      </v-col>

      <v-col class="text-center" cols="4">
        <v-menu
          location="end"
          transition="scale-transition"
          :close-on-content-click="false"        
        >
            <template v-slot:activator="{ props }">
              <v-text-field
                v-bind="props"
                label="Initial time"
                v-model="initial_time"
                prepend-icon="mdi-clock"
              ></v-text-field>
            </template>

            <v-time-picker
              color="primary"
              v-model="initial_time"
            ></v-time-picker>
        </v-menu>
      </v-col>  
             
      <v-col class="text-center"  cols="4">
        <v-menu
          location="end"
          transition="scale-transition"
          :close-on-content-click="false"        
        >
            <template v-slot:activator="{ props }">
              <v-text-field
                v-bind="props"
                label="Final time"
                v-model="final_time"
                prepend-icon="mdi-clock"
              ></v-text-field>
            </template>

            <v-time-picker
              color="primary"
              v-model="final_time"
            ></v-time-picker>
        </v-menu>
      </v-col>        
    </v-row>       
    <!-- {{filter.byDistrict}} {{selected}} -->
  </form>
</template>

<script setup>
  import { VTimePicker } from 'vuetify/labs/VTimePicker'
  import { ref, watch, onMounted } from 'vue';
  import moment from 'moment';
  import axios from 'axios';

  const BASE_URL  = import.meta.env.VITE_BACKEND_BASE_URL 

  const stationList = ref([])
  const variableList = ref([])
  const stationVariableList = ref([])
  const stationDistrictList = ref([])
  const stationWatershedList = ref([])
  const stationProfileList = ref([])

  onMounted( async () => {
    await axios.get(BASE_URL +'/api/stations/?format=json', {
      headers: {
        'Authorization': `Token ${import.meta.env.VITE_BACKEND_TOKEN}`
      }
    }).then((response) => {
      stationList.value = response.data.results
    });
  });

  onMounted( async () => {
    await axios.get(BASE_URL +'/api/variables/?format=json', {
      headers: {
        'Authorization': `Token ${import.meta.env.VITE_BACKEND_TOKEN}`
      }
    }).then((response) => {
      variableList.value = response.data.results
    });
  });

  onMounted( async () => {
    await axios.get(BASE_URL +'/api/stations_variables/?format=json', {
      headers: {
        'Authorization': `Token ${import.meta.env.VITE_BACKEND_TOKEN}`
      }
    }).then((response) => {
      stationVariableList.value = response.data.results
    });
  });

  onMounted( async () => {
    await axios.get(BASE_URL +'/api/administrative_regions/?format=json', {
      headers: {
        'Authorization': `Token ${import.meta.env.VITE_BACKEND_TOKEN}`
      }
    }).then((response) => {
      stationDistrictList.value = response.data.results
    });
  });

  onMounted( async () => {
    await axios.get(BASE_URL +'/api/watersheds/?format=json', {
      headers: {
        'Authorization': `Token ${import.meta.env.VITE_BACKEND_TOKEN}`
      }
    }).then((response) => {
      stationWatershedList.value = response.data.results
    });
  });


  onMounted(async () => {
      await axios.get(BASE_URL +'/api/station_profiles/?format=json', {
        headers: {
          'Authorization': `Token ${import.meta.env.VITE_BACKEND_TOKEN}`
        }
      }).then((response) => {
        stationProfileList.value = response.data.results
      });
    },
  );

  const data_sources = ref([
    {value: 0, text: "Raw data", source: "raw_data"},
    {value: 1, text: "Hourly summary", source: "hourly_summary"},
    {value: 2, text: "Daily summary", source: "daily_summary"},
    {value: 3, text: "Monthly summary", source: "monthly_summary"},
    {value: 4, text: "Yearly summary", source: "yearly_summary"},
  ])


  const filter = ref({
    byDistrict: false,
    isActive: false,
    isAutomatic: false,
  });

  const selected = ref({
    station: null,
    variable: null,
    profile: null,
    district: null,
    watershed: null,
    source: null,
  });  

  const clearDistrict = (filter, selected) => {
    if (filter.byDistrict){
      selected.watershed = null;
    }
    else if (!filter.byDistrict){
      selected.district = null;
    }
  };

  const getStationTitle = (station) => {
    return `${station.name} - ${station.code}`;
  }  

  const updateSelectedDate = () => {
    selectedDate.value = moment(formattedDate.value, 'YYYY-MM-DD').toDate();
  };

  const updateDate = (fdate, date) => {
    date.value = moment(fdate.value, 'YYYY-MM-DD').toDate();
  };

  const formatDate = (date,fdate) => {
    fdate.value = moment(date.value).format('YYYY-MM-DD')
  };  

  const location = 'end';

  const now = moment()

  const initial_date = ref(new Date(now));
  const finitial_date = ref(now.format("YYYY-MM-DD"));
  const initial_time = ref('00:00');

  const final_date = ref(new Date(now.add(1, 'days')));
  const ffinal_date = ref(now.add(1, 'days').format("YYYY-MM-DD"));
  const final_time = ref('00:00');

  const initial_date_menu = false;
  const initial_time_menu = false;
  const final_date_menu = false;
  const final_time_menu = false;

  watch(initial_date, () => {
    formatDate(initial_date, finitial_date)
  });

  watch(final_date, () => {
    formatDate(final_date, ffinal_date)
  });

</script>

<style scoped>
</style>

