import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import { useLocalSessionJsonObject } from './composables/local-session';
import type { AccessToken } from './services/authService';
import { TOKEN_SESSION_KEY, useAppStore } from './stores/app';

const app = createApp(App);

app.use(createPinia());
app.use(router);

// Check to see if there a a local storage access token
const persistSettings = useLocalSessionJsonObject<AccessToken>(TOKEN_SESSION_KEY);
const appStore = useAppStore();

if (persistSettings.setting) {
  appStore.setUserToken(persistSettings.setting, true);
}

app.mount('#app');
