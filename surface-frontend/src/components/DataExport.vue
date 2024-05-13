<template>
  <v-overlay class="centered-content" v-model="loading">
    <v-progress-circular indeterminate size="64"></v-progress-circular>
  </v-overlay>

  <v-alert
    class="ma-3"
    v-model="request_error"
    :text="request_error_message" 
    closable
    type="error"
  ></v-alert>

  <v-dialog v-model="dialog_del" width="35%">
    <v-card class="text-center">
      <v-card-title class="text-h5">
        Remove Series
      </v-card-title>
      <v-card-text class="ml-2">
          <v-form>
            <v-row>
              <v-col class="text-center" cols="6">
                <h3>Station</h3>
                <span>{{getStationTitle(current_item.station)}}</span>
              </v-col>       
              <v-col class="text-center" cols="6">
                <h3>Variable</h3>
                <span>{{current_item.variable.name}}</span>
              </v-col>                      
            </v-row>
          </v-form>
      </v-card-text>             
      <v-card-actions class="ml-2">
        <v-btn width="50%" variant="flat" color="grey" @click="dialog_del = false">
          Cancel
        </v-btn>
        <v-btn width="50%" variant="flat" color="error" @click="dialog_del = false; removeSeries()">
          Remove
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>  

  <form>
    <h2 class="ma-3">Station Filters</h2>

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
          item-value="id"
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
      <v-col class="text-center" cols="2">
        <v-switch
          v-model="filter.isAutomatic"
          color="primary"
          label="Automatic"
        ></v-switch>
      </v-col>
      <v-col class="text-center" cols="4">
        <v-autocomplete
          v-model="selected.station"
          label="Station"
          :items="filteredStationList"
          :item-title="getStationTitle"
          item-value="id"
          clearable
          persistent-hint
          hint="*Required"
        ></v-autocomplete>
      </v-col>     
      <v-col class="text-center" cols="4">
        <v-autocomplete
          v-model="selected.variable"
          label="Variable"
          :items="filteredVariableList"
          item-title="name"
          item-value="id"
          clearable
          persistent-hint
          hint="*Required"
        ></v-autocomplete>
      </v-col>           
    </v-row>
    <v-row class="mx-3" dense justify="end">
      <v-col align="end" cols="2">
        <v-btn
          color="primary"
          append-icon="mdi-magnify-plus"
          @click="addToSeries"
          :disabled="$v.selected.$invalid"
        > Add Series </v-btn>
      </v-col>   
    </v-row>

    <v-row class="ma-3">
      <v-alert
        class="ma-3"
        v-model="request_warning"
        :text="request_warning_message"
        closable
        type="warning"
      ></v-alert>
    </v-row>
  </form>

  <form>
    <v-row class="ma-3">
      <v-data-table
        :headers="data_table.headers"
        :items="data_table.series"
        height="400"
        item-value="name"
      >
        <template v-slot:item.percentage="{ item }">
          <div class="d-flex justify-center">
            <v-card
              width="25%"
              :color="getColor(item.percentage)"
              class="text-center"
            >
              {{item.percentage}} %
            </v-card>            
          </div> 
        </template>      
        <template v-slot:item.action="{ item }">
          <v-tooltip location="bottom" text="Remove Series">
            <template v-slot:activator="{ props }">
              <v-btn 
                v-bind="props"
                size="small"
                elevation="0"
                icon
                @click="dialog_del=true; current_item=item"                
              >
                <v-icon color="red" >mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-row>
  </form>

  <form>
    <v-row class="mx-3" dense justify="start">
      <v-col class="text-center" cols="4">
        <v-select
          v-model="selected.data_source"
          item-title="text"                
          :items="data_sources"
          label="Data Source"
          return-object
          clearable
          persistent-hint
          hint="*Required"
        ></v-select>
      </v-col>
        <v-col class="text-center"  cols="4" v-if="selected.data_source">
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
                prepend-inner-icon="mdi-calendar"
                @input="updateDate(finitial_date, initial_date)"
              ></v-text-field>
            </template>

            <v-date-picker
              color="primary"
              v-model="initial_date"
            ></v-date-picker>  
          </v-menu>
        </v-col>
        <v-col class="text-center"  cols="4" v-if="selected.data_source">
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
                prepend-inner-icon="mdi-calendar"
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
      <div v-if="selected.data_source">
        <v-row
          class="mx-3"
          dense
          justify="start"
          v-if="['raw_data', 'hourly_summary'].includes(selected.data_source.source)"
        >
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
                      prepend-inner-icon="mdi-clock"
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
                      prepend-inner-icon="mdi-clock"
                    ></v-text-field>
                  </template>

                  <v-time-picker
                    color="primary"
                    v-model="final_time"
                  ></v-time-picker>
              </v-menu>
            </v-col>
        </v-row>
      </div>
    <v-row class="mx-3" dense justify="end">
      <v-col align="end" cols="2">
        <v-btn
          color="primary"
          append-icon="mdi-database-search"
          @click="consultData"
          :disabled="(!selected.data_source) || (data_table.series.length === 0)"
        > Consult Data </v-btn>
      </v-col>  
      <v-col align="end" cols="2">
        <v-btn
          color="primary"
          append-icon="mdi-send"
          :disabled="(!selected.data_source) || (data_table.series.length === 0)"
        > Generate CSV </v-btn>
      </v-col>   
    </v-row>
  </form>
</template>

<script setup>
  import { VTimePicker } from 'vuetify/labs/VTimePicker'
  import { ref, watch, onMounted, computed } from 'vue';
  import moment from 'moment';
  import axios from 'axios';

  import { required } from '@vuelidate/validators';
  import { useVuelidate } from '@vuelidate/core';

  const dialog_del = ref(false)
        

  const station = ref(null)
  const variable = ref(null)

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
    data_source: null,
  });  


  const rules = {
    selected: {
      station: { required },
      variable: { required },
    },
  };

  const $v = useVuelidate(rules, { selected });

  const rules_query = {
    selected: {
      data_table: { required },
    },
  };  

  const $v_query = useVuelidate(rules_query, { selected });


  const BASE_URL  = import.meta.env.VITE_BACKEND_BASE_URL 

  let loading = ref(false);
  let request_error = ref(false);
  let request_error_message = ref("");

  let request_warning = ref(false);
  let request_warning_message = ref("");

  const stationList = ref([])
  const variableList = ref([])
  const stationVariableList = ref([])
  const stationDistrictList = ref([])
  const stationWatershedList = ref([])
  const stationProfileList = ref([])

  onMounted( async () => {
    loading.value = true;

    await axios.get(`${BASE_URL}/api/stations/?format=json`, {
      headers: {
        'Authorization': `Token ${import.meta.env.VITE_BACKEND_TOKEN}`
      }
    }).then((response) => {
      stationList.value = response.data.results
    }).catch(err => {
      request_error.value = true;
      request_error_message.value = err.response.data.detail;
      console.log(err)
    });;

    await axios.get(`${BASE_URL}/api/variables/?format=json`, {
      headers: {
        'Authorization': `Token ${import.meta.env.VITE_BACKEND_TOKEN}`
      }
    }).then((response) => {
      variableList.value = response.data.results
    }).catch(err => {
      request_error.value = true;
      request_error_message.value = err.response.data.detail;
      console.log(err)
    });;

    await axios.get(`${BASE_URL}/api/stations_variables/?format=json`, {
      headers: {
        'Authorization': `Token ${import.meta.env.VITE_BACKEND_TOKEN}`
      }
    }).then((response) => {
      stationVariableList.value = response.data.results
    }).catch(err => {
      request_error.value = true;
      request_error_message.value = err.response.data.detail;
      console.log(err)
    });;

    await axios.get(`${BASE_URL}/api/administrative_regions/?format=json`, {
      headers: {
        'Authorization': `Token ${import.meta.env.VITE_BACKEND_TOKEN}`
      }
    }).then((response) => {
      stationDistrictList.value = response.data.results
    }).catch(err => {
      request_error.value = true;
      request_error_message.value = err.response.data.detail;
      console.log(err)
    });;

    await axios.get(`${BASE_URL}/api/watersheds/?format=json`, {
      headers: {
        'Authorization': `Token ${import.meta.env.VITE_BACKEND_TOKEN}`
      }
    }).then((response) => {
      stationWatershedList.value = response.data.results
    }).catch(err => {
      request_error.value = true;
      request_error_message.value = err.response.data.detail;
      console.log(err)
    });;

    await axios.get(`${BASE_URL}/api/station_profiles/?format=json`, {
      headers: {
        'Authorization': `Token ${import.meta.env.VITE_BACKEND_TOKEN}`
      }
    }).then((response) => {
      stationProfileList.value = response.data.results
    }).catch(err => {
      request_error.value = true;
      request_error_message.value = err.response.data.detail;
      console.log(err)
    });

    loading.value = false;
  });

  const data_sources = ref([
    {value: 0, text: "Raw data", source: "raw_data"},
    {value: 1, text: "Hourly summary", source: "hourly_summary"},
    {value: 2, text: "Daily summary", source: "daily_summary"},
    {value: 3, text: "Monthly summary", source: "monthly_summary"},
    {value: 4, text: "Yearly summary", source: "yearly_summary"},
  ])


  const current_item = ref(null)

  const data_table = ref({
    headers: [
      { title: 'Station',
        align: 'center',
        key: 'station',
        value: item => getStationTitle(item.station)
      },
      { title: 'Variable',
        align: 'center',
        key: 'variable',
        value: 'variable.name'
      },
      {
        title: 'Available Data',
        align: 'center',
        key: 'percentage',
      },      
      {
        title: 'Action',
        align: 'center',
        key: 'action'
      },
    ],
    series: [],
  });

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

  const filteredStationList = computed(() => {
    let filteredStations = stationList.value

    if (selected.value.watershed){
      filteredStations = filteredStations.filter(
        station => station.watershed == selected.value.watershed
      )
    }

    if (selected.value.district){
      filteredStations = filteredStations.filter(
        station => station.region == selected.value.district
      )
    }

    if (selected.value.profile){
      filteredStations = filteredStations.filter(
        station => station.profile == selected.value.profile
      )
    }

    filteredStations = filteredStations.filter(
      station => station.is_automatic == filter.value.isAutomatic
    );

    filteredStations = filteredStations.filter(
      station => station.is_active == filter.value.isActive
    );    

    selected.value.station = null
    selected.value.variable = null

    return filteredStations
  });

  const filteredVariableList = computed(() => {
    if (!selected.value.station){
      return []
    }

    let filteredStationVariable = stationVariableList.value
    let filteredVariables = variableList.value

    if (selected.value.station){
      filteredStationVariable = filteredStationVariable.filter(
        station_var => station_var.station == selected.value.station
      );


      filteredVariables = filteredVariables.filter(
        variable => filteredStationVariable.some(
          stationVariable => stationVariable.variable === variable.id
        )
      )      
    }
    return filteredVariables;
  });  

  watch(initial_date, () => {
    formatDate(initial_date, finitial_date)
  });

  watch(final_date, () => {
    formatDate(final_date, ffinal_date)
  });

  const clearSelected = () =>{
    selected.value = {
      station: null,
      variable: null,
      profile: null,
      district: null,
      watershed: null,
      data_source: selected.value.data_source,
    }
  }

  const getDictByKey = (arr, key, value) => {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i][key] === value) {
        return arr[i];
      }
    }
    return null;
  }

  const dictExists = (arr, obj, keys) => {
    for (var i = 0; i < arr.length; i++) {
      if (JSON.stringify(arr[i]) === JSON.stringify(obj)) {
        return true;
      }
    }
    return false;
  }

  const dictExistsKeys = (arr, obj, keys) => {
    for (var i = 0; i < arr.length; i++) {
      let found = true;
      for (var j = 0; j < keys.length; j++) {
        const key = keys[j];
        if (JSON.stringify(arr[i][key]) !== JSON.stringify(obj[key])) {
          found = false;
          break;
        }
      }
      if (found) {
        return true;
      }
    }
    return false;
  } 

  const addToSeries = () => {
    request_warning.value = false
    request_warning_message.value = ""

    let station = getDictByKey(stationList.value, 'id', selected.value.station)
    let variable = getDictByKey(variableList.value, 'id', selected.value.variable)

    let new_entry = {
      station: station,
      variable: variable,
      action: "Actions Here",
      // percentage: Math.round(Math.random() * 1000)/10
      percentage: null,
    }

    if(!dictExistsKeys(data_table.value.series, new_entry, ['station', 'variable'])){
      data_table.value.series.push(new_entry);
      clearSelected();
    }    
    else{
      request_warning.value = true
      request_warning_message.value = "Series already in data table!"
    }
  };

  const removeSeries = () => {
    let station_id = current_item.value.station.id
    let variable_id = current_item.value.variable.id

    data_table.value.series = data_table.value.series.filter(
      series => !((series.station.id==station_id) & (series.variable.id==variable_id))
    );
  }

  const consultData = () => {
    data_table.value.series.forEach(
      series => series.percentage = Math.round(Math.random() * 1000)/10
    );
  }

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

  const getColor = (percent) =>{
    if (percent === null) {
      return 'rgb(0,0,0)'
    }

    var max_red = [240, 128, 128];
    var max_green = [144, 238, 144];

    var color = [];
    for (var i = 0; i < 3; i++) {
        color[i] = Math.round(max_red[i] + (max_green[i] - max_red[i]) * (percent / 100));
    }

    return  'rgb('+color[0]+','+color[1]+','+color[2]+')'
  }
</script>

<style scoped>
.centered-content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Adjust as needed */
}
</style>

