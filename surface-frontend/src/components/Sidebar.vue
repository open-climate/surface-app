<template>
  <v-navigation-drawer 
    app
    v-model="drawer"
    color="white"
    @mouseover="expandSidebar()"
    @mouseleave="colapseSidebar(); setSubList(null)"
    :width = "sidebar.width"
  >
    <v-list>
      <v-list-item prepend-avatar="/public/circle_logo_small.png">
        <img src="/public/surface_logo_smaller.png" />
      </v-list-item>


      <v-list-item prepend-icon="mdi-account">
        <template v-slot:prepend>
          <v-icon size="large" style="margin-left: 4.5px"> mdi-account </v-icon>
        </template>
        <v-list-item-title v-if="!sidebar.colapsed" v-text="username"/>
      </v-list-item>

      <hr>
      <v-list-item @click="setSubList('STATIONS')">
        <template v-slot:prepend>
          <v-icon size="large" style="margin-left: 4.5px"> mdi-crosshairs-gps </v-icon>
        </template>
        <v-list-item-title v-if="!sidebar.colapsed" v-text="$t('sidebarStations')"/>
      </v-list-item>   

      <v-list v-if="sublist=='STATIONS'">
        <v-list-item size="large" @click="model=false">
          <template v-slot:append>
            <v-icon size="large"> mdi-map </v-icon>
          </template>           
          <v-list-item-title style="margin-left: 65px" v-text="'MAP'"/>
        </v-list-item>
        <v-list-item size="large" @click="model=false">
            <template v-slot:append>
              <v-icon size="large"> mdi-chart-donut </v-icon>
            </template>           
            <v-list-item-title style="margin-left: 65px" v-text="'LIST'"/>
        </v-list-item>
        <v-list-item size="large" @click="model=false">
          <template v-slot:append>
            <v-icon size="large"> mdi-chart-donut </v-icon>
          </template>           
          <v-list-item-title style="margin-left: 65px" v-text="'METADATA'"/>
        </v-list-item>
        <v-list-item size="large" @click="model=false">
          <template v-slot:append>
            <v-icon size="large"> mdi-monitor </v-icon>
          </template>           
          <v-list-item-title style="margin-left: 65px" v-text="'STATIONS MONITORING'"/>
        </v-list-item>                        
      </v-list>

      <v-list-item @click="setSubList('EXTENTIONS')">
        <template v-slot:prepend>
          <v-icon size="large" style="margin-left: 4.5px"> mdi-puzzle </v-icon>
        </template>
        <v-list-item-title v-if="!sidebar.colapsed" v-text="'EXTENTIONS'"/>
      </v-list-item>

      <v-list v-if="sublist=='EXTENTIONS'">
        <v-list-item size="large" @click="model=true">
          <template v-slot:append>
            <v-icon size="large"> mdi-cloud-download </v-icon>
          </template>           
          <v-list-item-title style="margin-left: 65px" v-text="'DATA EXPORT'"/>
        </v-list-item>
      </v-list>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
  import { ref, watch, onMounted, defineModel } from 'vue';
  import axios from 'axios';

  const BASE_URL  = import.meta.env.VITE_BACKEND_BASE_URL 

  const open = ref(false)
  const sublist = ref(null)
  const items = ref(['Station 1', 'Station 2', 'Station 3'])

  const model = defineModel();

  const drawer = ref(true);
  const username = ref(null);

  const sidebar = ref({
    width: 70,
    colapsed: true, 
  })

  onMounted( async () => {
    await axios.get(`${BASE_URL}/api/user_info/`, {
      headers: {
        'Authorization': `Token ${import.meta.env.VITE_BACKEND_TOKEN}`
      }
    }).then(response => {
      username.value = response.data.username.toUpperCase()
    }).catch(err => {
      request_error.value = true;
      request_error_message.value = err.response.data.detail;
      console.log(err)
    });
  })

  const colapseSidebar = () => {
    sidebar.value.colapsed = true;
    sidebar.value.width=70        
  }

  const expandSidebar = () => {
    sidebar.value.colapsed = false;
    sidebar.value.width=300
  }

  const setSubList = (value) => {
    sublist.value = (sublist.value === value) ? null : value;
  }


</script>
