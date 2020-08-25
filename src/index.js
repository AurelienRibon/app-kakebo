import Vue from 'vue';
import App from './App.vue';
import './directives/v-ripple.js';

new Vue({ render: (createElement) => createElement(App) }).$mount('#app');
