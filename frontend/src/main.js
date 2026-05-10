import { createApp } from 'vue'
import App from './App.vue'
import Router from './routes'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css'
import "@fontsource/poppins"; // Defaults to weight 400
import "@fontsource/poppins/700.css"; // Optional: specific weights
import VueCookies from 'vue-cookies'

const app = createApp(App)
app.use(Router)
app.use(VueCookies)
app.mount('#app')
