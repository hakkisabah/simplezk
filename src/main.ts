import './index.css'

import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'

const pinia = createPinia()

App.use(pinia)
createApp(App).mount('#app')
