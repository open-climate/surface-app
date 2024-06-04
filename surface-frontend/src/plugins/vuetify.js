/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

import { en, es, pt } from 'vuetify/locale'

import custom_en from '../i18n/vuetify/en'
import custom_es from '../i18n/vuetify/es'
import custom_pt from '../i18n/vuetify/pt'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides

const messages = {
  en: {
  	...en,
  	...custom_en,
  },
  es: {
  	...es,
  	...custom_es,
  },
  pt: {
  	...pt,
  	...custom_pt,
  },  
}

console.log(messages)

export default createVuetify({
  locale: {
    locale: 'en',
    fallback: 'en',
    messages: messages,	
  },
  theme: {
    // defaultTheme: 'dark',
  },
})
