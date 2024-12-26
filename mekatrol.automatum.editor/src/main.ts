import './assets/main.scss';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';

import 'vue-boosted/index.css';

const app = createApp(App);

app.use(createPinia());

app.mount('#app');
