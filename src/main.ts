import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';
import App from './App.vue';

import './styles/global.css';
import './games/registerAll';

import { i18n, setLocale } from './i18n';
import { useConfigStore } from './stores/config';

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
app.use(router);
app.use(i18n);

const config = useConfigStore();
await setLocale(config.language);

app.mount('#app');