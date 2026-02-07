import { createApp } from 'vue'
import App from './App.vue'
import uiUtil from './utils/ui.util'


createApp(App)
    .use(uiUtil)
    .mount('#app')
