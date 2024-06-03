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
          <v-icon size="large" class="list-icon"> mdi-account </v-icon>
          <v-list-item-title class="list-item" v-if="!sidebar.colapsed" v-text="username"/>
        </template>
      </v-list-item>

      <hr>

      <v-list-item @click="setSubList('STATIONS')">
        <template v-slot:prepend>
          <v-icon size="large" class="list-icon"> mdi-crosshairs-gps </v-icon>
          <v-list-item-title class="list-item" v-if="!sidebar.colapsed" v-text="$t('sidebarStations')"/>
        </template>        
      </v-list-item>   

      <v-list v-if="sublist=='STATIONS'">
        <v-list-item size="large" @click="model=false">
          <template v-slot:append>
            <v-icon size="large"> mdi-map </v-icon>
          </template>           
          <v-list-item-title class="sublist-item" v-text="'MAP'"/>
        </v-list-item>
        <v-list-item size="large" @click="model=false">
            <template v-slot:append>
              <v-icon size="large"> mdi-chart-donut </v-icon>
            </template>           
            <v-list-item-title class="sublist-item" v-text="'LIST'"/>
        </v-list-item>
        <v-list-item size="large" @click="model=false">
          <template v-slot:append>
            <v-icon size="large"> mdi-chart-donut </v-icon>
          </template>           
          <v-list-item-title class="sublist-item" v-text="'METADATA'"/>
        </v-list-item>
        <v-list-item size="large" @click="model=false">
          <template v-slot:append>
            <v-icon size="large"> mdi-monitor </v-icon>
          </template>           
          <v-list-item-title class="sublist-item" v-text="'STATIONS MONITORING'"/>
        </v-list-item>                        
      </v-list>

      <v-list-item @click="setSubList('MAINTENANCE')">
        <template v-slot:prepend>
          <v-icon size="large" class="list-icon"> mdi-wrench </v-icon>
          <v-list-item-title class="list-item" v-if="!sidebar.colapsed" v-text="'MAINTENANCE'"/>
        </template>        
      </v-list-item>   

      <v-list v-if="sublist=='MAINTENANCE'">
        <v-list-item size="large" @click="model=false">
          <template v-slot:append>
            <v-icon size="large"> mdi-clipboard-check-outline </v-icon>
          </template>           
          <v-list-item-title class="sublist-item" v-text="'EQUIPMENT INVENTORY'"/>
        </v-list-item>
        <v-list-item size="large" @click="model=false">
            <template v-slot:append>
              <v-icon size="large"> mdi-wrench </v-icon>
            </template>
            <v-list-item-title class="sublist-item" v-text="'MAINTENANCE REPORTS'"/>
        </v-list-item>                     
      </v-list>

      <v-list-item @click="setSubList('DATA')">
        <template v-slot:prepend>
          <v-icon size="large" class="list-icon"> mdi-chart-donut </v-icon>
          <v-list-item-title class="list-item" v-if="!sidebar.colapsed" v-text="'DATA'"/>
        </template>        
      </v-list-item>   

      <v-list v-if="sublist=='DATA'">
        <v-list-item size="large" @click="model=false">
            <template v-slot:append>
              <v-icon size="large"> mdi-keyboard </v-icon>
            </template>           
            <v-list-item-title class="sublist-item" v-text="'DAILY CAPTURE FORM'"/>
        </v-list-item>
        <v-list-item size="large" @click="model=false">
            <template v-slot:append>
              <v-icon size="large"> mdi-keyboard </v-icon>
            </template>           
            <v-list-item-title class="sublist-item" v-text="'SYNOP CAPTURE FORM'"/>
        </v-list-item>
        <v-list-item size="large" @click="model=false">
            <template v-slot:append>
              <v-icon size="large"> mdi-cloud-download </v-icon>
            </template>           
            <v-list-item-title class="sublist-item" v-text="'EXPORT'"/>
        </v-list-item>
        <v-list-item size="large" @click="model=false">
            <template v-slot:append>
              <v-icon size="large"> mdi-monitor-dashboard </v-icon>
            </template>           
            <v-list-item-title class="sublist-item" v-text="'DATA INVENTORY'"/>
        </v-list-item>        
      </v-list>


      <v-list-item @click="setSubList('QUALITY CONTROLL')">
        <template v-slot:prepend>
          <v-icon size="large" class="list-icon"> mdi-playlist-check </v-icon>
          <v-list-item-title class="list-item" v-if="!sidebar.colapsed" v-text="'QUALITY CONTROL'"/>
        </template>        
      </v-list-item>   


      <v-list v-if="sublist=='QUALITY CONTROLL'">
        <v-list-item size="large" @click="model=false">
            <template v-slot:append>
              <v-icon size="large"> mdi-check-all </v-icon>
            </template>           
            <v-list-item-title class="sublist-item" v-text="'DAILY CAPTURE FORM'"/>
        </v-list-item>
        <v-list-item size="large" @click="model=false">
            <template v-slot:append>
              <v-icon size="large"> mdi-notification-clear-all </v-icon>
            </template>           
            <v-list-item-title class="sublist-item" v-text="'SYNOP CAPTURE FORM'"/>
        </v-list-item>
        <v-list-item size="large" @click="model=false">
            <template v-slot:append>
              <v-icon size="large"> mdi-priority-low </v-icon>
            </template>           
            <v-list-item-title class="sublist-item" v-text="'EXPORT'"/>
        </v-list-item>
        <v-list-item size="large" @click="model=false">
            <template v-slot:append>
              <v-icon size="large"> mdi-format-align-left </v-icon>
            </template>           
            <v-list-item-title class="sublist-item" v-text="'DATA INVENTORY'"/>
        </v-list-item>        
      </v-list>


      <v-list-item @click="setSubList('PRODUCTS')">
        <template v-slot:prepend>
          <v-icon size="large" class="list-icon"> mdi-list-box-outline </v-icon>
          <v-list-item-title class="list-item" v-if="!sidebar.colapsed" v-text="'PRODUCTS'"/>
        </template>        
      </v-list-item>

      <v-list v-if="sublist=='PRODUCTS'">
        <v-list-item size="large" @click="model=true">
          <template v-slot:append>
            <v-icon size="large"> mdi-account-multiple </v-icon>
          </template>           
          <v-list-item-title class="sublist-item" v-text="'STATION REPORT'"/>
        </v-list-item>
        <v-list-item size="large" @click="model=true">
          <template v-slot:append>
            <v-icon size="large"> mdi-view-list </v-icon>
          </template>           
          <v-list-item-title class="sublist-item" v-text="'VARIABLE REPORT'"/>
        </v-list-item>      
        <v-list-item size="large" @click="model=true">
          <template v-slot:append>
            <v-icon size="large"> mdi-swap-horizontal </v-icon>
          </template>           
          <v-list-item-title class="sublist-item" v-text="'STATION COMPARE'"/>
        </v-list-item>
        <v-list-item size="large" @click="model=true">
          <template v-slot:append>
            <v-icon size="large"> mdi-view-dashboard </v-icon>
          </template>           
          <v-list-item-title class="sublist-item" v-text="'SPATIAL ANALYSIS'"/>
        </v-list-item>
        <v-list-item size="large" @click="model=true">
          <template v-slot:append>
            <v-icon size="large"> mdi-poll </v-icon>
          </template>           
          <v-list-item-title class="sublist-item" v-text="'EXTREMES AND MEANS'"/>
        </v-list-item>
        <v-list-item size="large" @click="model=true">
          <template v-slot:append>
            <v-icon size="large"> mdi-waves </v-icon>
          </template>           
          <v-list-item-title class="sublist-item" v-text="'WAVE DATA ANALYSIS'"/>
        </v-list-item>                
      </v-list>

      <v-list-item @click="setSubList('EXTENTIONS')">
        <template v-slot:prepend>
          <v-icon size="large" class="list-icon"> mdi-puzzle </v-icon>
          <v-list-item-title class="list-item" v-if="!sidebar.colapsed" v-text="'EXTENTIONS'"/>
        </template>        
      </v-list-item>

      <v-list v-if="sublist=='EXTENTIONS'">
        <v-list-item size="large" @click="model=true">
          <template v-slot:append>
            <v-icon size="large"> mdi-cloud-download </v-icon>
          </template>           
          <v-list-item-title class="sublist-item" v-text="'DATA EXPORT'"/>
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
    sidebar.value.width=340
  }

  const setSubList = (value) => {
    sublist.value = (sublist.value === value) ? null : value;
  }
</script>

<style scoped>
.sublist-item  {
  margin-left: 52px;
}
.list-item  {
  margin-left: 20px
}
.list-icon {
  margin-left: 4.5px;
}
</style>