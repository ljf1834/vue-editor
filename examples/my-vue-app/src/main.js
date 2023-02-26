import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import VueEditor from 'vue-editor'
import 'vue-editor/style.css'
import 'vue-editor/icon.css'

const app = createApp(App)
app.use(VueEditor)
app.mount('#app')
