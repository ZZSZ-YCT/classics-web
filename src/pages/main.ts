import { createApp } from 'vue'
import './article/style.css'
import '../assets/main.css'
import App from './App.vue'
import router from "../router/router.ts"


createApp(App)
    .use(router)
    .mount('#app')
