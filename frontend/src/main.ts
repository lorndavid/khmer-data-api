import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './style.css';

// Prevent browser from restoring old mid-page scroll position on reload
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

app.mount('#app');
