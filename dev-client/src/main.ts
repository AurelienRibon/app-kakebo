import { createApp } from 'vue';
import { getVRippleDirective } from './directives/v-ripple';
import App from './App.vue';

updateCSSViewportHeight();

const app = createApp(App);
app.directive('ripple', getVRippleDirective());
app.mount('#app');

// -----------------------------------------------------------------------------
// HELPERS
// -----------------------------------------------------------------------------

function updateCSSViewportHeight() {
  const vwHeight = visualViewport.height;
  document.documentElement.style.setProperty('--vwHeight', `${vwHeight}px`);
}
