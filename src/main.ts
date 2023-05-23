/** @format */
import App from './App.vue';
import router from './router';

// import 'default-passive-events';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import './assets/iconfont/iconfont.css';
import './style/less/main.less';

const app = createApp(App);

app.use(createPinia()).use(router).mount('#app');
