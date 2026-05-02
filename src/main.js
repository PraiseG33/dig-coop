// src/main.js
import './styles.css'
import 'aos/dist/aos.css'
import AOS from 'aos'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

AOS.init({
  duration: 800,
  easing: 'ease-in-out',
  once: true,
  offset: 80
})

const app = createApp(App)

app.use(router)
// app.use(pinia)
app.mount('#app')