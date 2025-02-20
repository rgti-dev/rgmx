import { createApp } from 'vue';
import { createPinia } from 'pinia';

import { useAuthStore } from './store/auth';
import router from './router';
import App from './App.vue';
import './style.css';

const app = createApp(App);
app.use(createPinia());
app.use(router);

const auth = useAuthStore();
document.addEventListener('mousemove', auth.resetActivityTimer);
document.addEventListener('keypress', auth.resetActivityTimer);
document.addEventListener('click', auth.resetActivityTimer);

app.mount('#app');
