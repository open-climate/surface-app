import { createApp, computed } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'

import { registerPlugins } from '@/plugins'
import '@mdi/font/css/materialdesignicons.css'

import dataExportMessages from '@/i18n/DataExport'
import sidebarMessages from '@/i18n/Sidebar'

const messages = {
  en: {
    ...dataExportMessages.en,
    ...sidebarMessages.en
  },
  es: {
    ...dataExportMessages.es,
    ...sidebarMessages.es
  }
}

let browserLanguage = navigator.languages ? navigator.languages[0] : (navigator.language || navigator.userLanguage)
browserLanguage = browserLanguage.split('-')[0]

if (!messages[browserLanguage]) {
  browserLanguage = 'en'
}

const i18n = createI18n({
  locale: browserLanguage,
  fallbackLocale: 'en',
  messages: messages
})

const app = createApp(App)

registerPlugins(app)

app.use(i18n)
app.mount('#app')
