import { createApp } from 'vue';
import { getVRippleDirective } from './directives/v-ripple';
import App from './App.vue';

const app = createApp(App);

app.directive('ripple', getVRippleDirective());
app.mount('#app');
