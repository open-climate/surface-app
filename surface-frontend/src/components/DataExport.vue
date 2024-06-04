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
        {{t('$vuetify.DataExport.RemoveSeries')}}
      </v-card-title>
      <v-card-text class="ml-2">
          <v-form>
            <v-row>
              <v-col class="text-center" cols="6">
                <h3>{{t('$vuetify.DataExport.Station')}}</h3>
                <span>{{getStationTitle(current_item.station)}}</span>
              </v-col>       
              <v-col class="text-center" cols="6">
                <h3>{{t('$vuetify.DataExport.Variable')}}</h3>
                <span>{{current_item.variable.name}}</span>
              </v-col>                      
            </v-row>
          </v-form>
      </v-card-text>             
      <v-card-actions class="ml-2">
        <v-btn width="50%" variant="flat" color="grey" @click="dialog_del = false">
          {{t('$vuetify.DataExport.Cancel')}}
        </v-btn>
        <v-btn width="50%" variant="flat" color="error" @click="dialog_del = false; removeSeries()">
          {{t('$vuetify.DataExport.Remove')}}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>  

  <form class="ma-5">
    <h1 class="ma-3 my-10"> {{t('$vuetify.DataExport.DataExport')}} </h1>

    <h3 class="ma-3"> {{t('$vuetify.DataExport.StationFilters')}} </h3>

    <v-row class="mx-3" dense justify="start">
      <v-col class="text-center" cols="2">
        <v-switch
          v-model="filter.byDistrict"
          color="primary"
          :label="t('$vuetify.DataExport.FilterByDistrict')"
          @change="clearDistrict(filter, selected)"
        ></v-switch> 
      </v-col>      
      <v-col class="text-center" cols="3">
        <v-autocomplete
          item-title="name"
          item-value="name"
          v-model="selected.district"
          :items="stationDistrictList"
          :label="t('$vuetify.DataExport.District')"
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
          :label="t('$vuetify.DataExport.Watershed')"
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
          :label="t('$vuetify.DataExport.Profile')"          
          clearable
        ></v-autocomplete>
      </v-col>       
    </v-row>
    <v-row class="mx-3" dense justify="start">
      <v-col class="text-center" cols="2">
        <v-switch
          v-model="filter.isActive"
          color="primary"
          :label="t('$vuetify.DataExport.Active')"          
        ></v-switch>              
      </v-col>
      <v-col class="text-center" cols="2">
        <v-switch
          v-model="filter.isAutomatic"
          color="primary"
          :label="t('$vuetify.DataExport.Automatic')"          
        ></v-switch>
      </v-col>
      <v-col class="text-center" cols="4">
        <v-autocomplete
          v-model="selected.station"
          :label="t('$vuetify.DataExport.Station')"          
          :items="filteredStationList"
          :item-title="getStationTitle"
          item-value="id"
          clearable
          persistent-hint
          :hint="t('$vuetify.DataExport.RequiredHint')"
        ></v-autocomplete>
      </v-col>     
      <v-col class="text-center" cols="4">
        <v-autocomplete
          v-model="selected.variable"
          :label="t('$vuetify.DataExport.Variable')"          
          :items="filteredVariableList"
          item-title="name"
          item-value="id"
          clearable
          persistent-hint
          :hint="t('$vuetify.DataExport.RequiredHint')"
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
        > {{ t('$vuetify.DataExport.AddSeries')}} </v-btn>
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

  <form class="ma-5">
    <v-row class="mx-3" dense justify="start">
      <v-col class="text-center" cols="4">
        <v-select
          v-model="selected.data_source"
          item-title="text"                
          :items="data_sources"
          :label="t('$vuetify.DataExport.DataSource')"          
          return-object
          clearable
          persistent-hint
          :hint="t('$vuetify.DataExport.RequiredHint')"
        ></v-select>
      </v-col>
        <v-col class="text-center"  cols="4" v-if="selected.data_source">
          <SurfaceDatePicker
            :label="t('$vuetify.DataExport.InitialDate')"
            v-model="initial_date"/>
        </v-col>
        <v-col class="text-center"  cols="4" v-if="selected.data_source">
          <SurfaceDatePicker 
            :label="t('$vuetify.DataExport.FinalDate')"
            v-model="final_date"/>          
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
              <SurfaceTimePicker
                :label="t('$vuetify.DataExport.InitialTime')"                
                v-model="initial_time"/>                    
            </v-col>  
                   
            <v-col class="text-center"  cols="4">
              <SurfaceTimePicker
                :label="t('$vuetify.DataExport.FinalTime')"                
                v-model="final_time"/>
            </v-col>
        </v-row>
      </div>
  </form>

  <form class="ma-5">
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
              :loading="loading.value"
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
                <v-icon color="red">mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-row>
  </form>

  <form class="ma-5">
    <v-row class="mx-3" dense justify="end">
      <v-col align="end" cols="2">
        <v-select
          v-model="selected.file_format"
          item-title="text"
          item-value='format'          
          :items="file_formats"
          :label="t('$vuetify.DataExport.FileFormat')"
        ></v-select>    
      </v-col>      
      <v-col align="end" cols="2">
        <v-btn
          color="primary"
          append-icon="mdi-send"
          @click="queryData"
          :disabled="(!selected.data_source) || (data_table.series.length === 0)"
        > {{t('$vuetify.DataExport.DownloadFile')}} </v-btn>
      </v-col>   
    </v-row>
  </form>  
</template>

<script setup>
  import { ref, watch, onMounted, computed } from 'vue';
  import moment from 'moment';
  import axios from 'axios';

  import { required } from '@vuelidate/validators';
  import { useVuelidate } from '@vuelidate/core';

  import { useLocale } from 'vuetify'
  const { t } = useLocale()  

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
    file_format: 'csv',
  });  

  const rules = {
    selected: {
      station: { required },
      variable: { required },
    },
  };

  const $v = useVuelidate(rules, { selected });

  const BASE_URL  = import.meta.env.VITE_BACKEND_BASE_URL 
  const PYGEOAPI_URL = import.meta.env.VITE_BACKEND_PYGEOAPI_BASE_URL

  const loading = ref(false);
  const request_error = ref(false);
  const request_error_message = ref("");

  const request_warning = ref(false);
  const request_warning_message = ref("");

  const stationList = ref([])
  const variableList = ref([])
  const stationVariableList = ref([])
  const stationDistrictList = ref([])
  const stationWatershedList = ref([])
  const stationProfileList = ref([])

  const data_sources = ref([
    {value: 0, text: t('$vuetify.DataExport.RawData'), source: "raw_data"},
    {value: 1, text: t('$vuetify.DataExport.HourlySummary'), source: "hourly_summary"},
    {value: 2, text: t('$vuetify.DataExport.DailySummary'), source: "daily_summary"},
    {value: 3, text: t('$vuetify.DataExport.MonthlySummary'), source: "monthly_summary"},
    {value: 4, text: t('$vuetify.DataExport.YearlySummary'), source: "yearly_summary"},
  ])

  const file_formats = ref([
    {text: "CSV ", format: "csv"},
    {text: "Excel", format: "xcell"},
    {text: "R-Instat", format: "r_instat"},
  ])

  const current_item = ref(null)

  const data_table = ref({
    headers: [
      { title: t('$vuetify.DataExport.Station'),
        align: 'center',
        key: 'station',
        value: item => getStationTitle(item.station)
      },
      { title: t('$vuetify.DataExport.Variable'),
        align: 'center',
        key: 'variable',
        value: 'variable.name'
      },
      { title: t('$vuetify.DataExport.FirstDate'),
        align: 'center',
        key: 'first_date',
        value: 'first_date'
      },
      { title: t('$vuetify.DataExport.LastDate'),
        align: 'center',
        key: 'last_date',
        value: 'last_date'
      },            
      {
        title: t('$vuetify.DataExport.AvailableDates'),
        align: 'center',
        key: 'percentage',
      },      
      {
        title: t('$vuetify.DataExport.Action'),
        align: 'center',
        key: 'action'
      },
    ],
    series: [],
  });

  const now = moment()

  const initial_date = ref(now.format("YYYY-MM-DD"));
  const initial_time = ref('00:00');

  const final_date = ref(now.add(1, 'days').format("YYYY-MM-DD"));
  const final_time = ref('00:00');

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

  onMounted( async () => {
    await fetchData(`${BASE_URL}/api/stations/?format=json`, stationList)

    await fetchData(`${BASE_URL}/api/variables/?format=json`, variableList)

    // await fetchData(`${BASE_URL}/api/stations_variables/?format=json`, stationVariableList)

    await fetchData(`${BASE_URL}/api/administrative_regions/?format=json`, stationDistrictList)

    await fetchData(`${BASE_URL}/api/watersheds/?format=json`, stationWatershedList)    

    await fetchData(`${BASE_URL}/api/station_profiles/?format=json`, stationProfileList)    
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

  watch(() => selected.value.data_source, (newValue, oldValue) => {
    clearAvailableData()
    if (selected.value.data_source!=null && data_table.value.series.length > 0){
      checkData()
    }
  });

  watch(() => selected.value.station, (newValue, oldValue) => {
    if (newValue === null){
      stationVariableList.value = []
    }
    else {
      getVariables(newValue)
    }
  });

  watch([initial_date, initial_time, final_date, final_time], () => {
    clearAvailableData()
    if (selected.value.data_source!=null && data_table.value.series.length > 0){
      checkData()
    }
  });

  const fetchData = async (url, variable) => {
    loading.value = true

    let nextPage = new URL(url);
    
    nextPage = `${BASE_URL}${nextPage.pathname}${nextPage.search}`
    while (nextPage) {
      await axios.get(nextPage, {
        headers: {
          'Authorization': `Token ${import.meta.env.VITE_BACKEND_TOKEN}`
        }
      }).then(response => {
        variable.value.push(...response.data.results);
        nextPage = response.data.next
        if (nextPage) {
          nextPage = new URL(nextPage);
          nextPage = `${BASE_URL}${nextPage.pathname}${nextPage.search}`
        }
      }).catch(err => {
        request_error.value = true;
        request_error_message.value = err.response.data.detail;
        console.log(err)
      });
    }

    loading.value = false
  };

  const clearAvailableData = () =>{
    data_table.value.series.forEach(series => {
      series['percentage'] = null;
      series['first_date'] = null;
      series['last_date'] = null;
    })
  }

  const getVariables = async (station_id) => {
    loading.value = true
    await axios.get(`${BASE_URL}/api/stations_variables/?format=json`, {
      params: {'station_id': station_id},
      headers: {
        'Authorization': `Token ${import.meta.env.VITE_BACKEND_TOKEN}`
      }
    }).then(response => {
      stationVariableList.value = response.data.results
    }).catch(err => {
      request_error.value = true;
      request_error_message.value = err.response.data.detail;
      console.log(err)
    });

    loading.value = false
  };

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
      first_date: null,
      last_date: null,      
      action: "Actions Here",
      percentage: null,
    }

    if(!dictExistsKeys(data_table.value.series, new_entry, ['station', 'variable'])){
      data_table.value.series.push(new_entry);
      if (selected.value.data_source) {
        checkSeriesData();
      }
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

  const checkDataRandom = () => {
    data_table.value.series.forEach(
      series => series.percentage = Math.round(Math.random() * 1000)/10
    );
  }

  const updateDataTable = (new_data) =>{
    for (let dict1 of data_table.value.series) {
        for (let dict2 of new_data) {
            if ((dict1["station"]["id"] === dict2["station_id"]) &&
               (dict1["variable"]["id"]  === dict2["variable_id"])){
                dict1["first_date"] = dict2["first_date"];
                dict1["last_date"] = dict2["last_date"];
                dict1["percentage"] = dict2["percentage"];
                break;
            }
        }
    }
  }

  const checkSeriesData = async () => {
    loading.value = true;

    let json_data = {
      'initial_date': initial_date.value,
      'initial_time': initial_time.value,
      'final_date': final_date.value,
      'final_time': final_time.value,
      'data_source': selected.value.data_source.source,
      'series': [{'station_id': selected.value.station, 'variable_id': selected.value.variable}]
    };

    await axios.post(`${BASE_URL}/api/available_data/`, 
      json_data,
      {
        headers: {
          'Authorization': `Token ${import.meta.env.VITE_BACKEND_TOKEN}`,
          'Content-Type': 'application/json',
        }
      }
    ).then(response => {
      updateDataTable(response.data.data)
    }).catch(err => {
      request_error.value = true;
      request_error_message.value = err.response.data.detail;
      console.log(err)
    });

    loading.value = false;
  }  

  const queryData = async () => {
    loading.value = true;

    let series = data_table.value.series.map(row => ({
      'station_id': row.station.id,
      'variable_id': row.variable.id
    }));

    let json_data = {
      'initial_date': initial_date.value,
      'initial_time': initial_time.value,
      'final_date': final_date.value,
      'final_time': final_time.value,
      'data_source': selected.value.data_source.source,
      'series': series
    };

    // params = new url.URLSearchParams(json_data);

    await axios({
      url: `${PYGEOAPI_URL}/data_export`,
      method: 'GET',
      responseType: 'blob', // important
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'file.csv'); // or any other extension
      document.body.appendChild(link);
      link.click();
    }).catch(err => {
      request_error.value = true;
      console.log(err)
    });
      loading.value = false;   
    }

  const checkData = async () => {
    loading.value = true;

    let series = data_table.value.series.map(row => ({
      'station_id': row.station.id,
      'variable_id': row.variable.id
    }));

    let json_data = {
      'initial_date': initial_date.value,
      'initial_time': initial_time.value,
      'final_date': final_date.value,
      'final_time': final_time.value,
      'data_source': selected.value.data_source.source,
      'series': series
    };

    await axios.post(`${BASE_URL}/api/available_data/`, 
      json_data,
      {
        headers: {
          'Authorization': `Token ${import.meta.env.VITE_BACKEND_TOKEN}`,
          'Content-Type': 'application/json',
        }
      }
    ).then(response => {
      updateDataTable(response.data.data)
    }).catch(err => {
      request_error.value = true;
      request_error_message.value = err.response.data.detail;
      console.log(err)
    });

    loading.value = false;
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