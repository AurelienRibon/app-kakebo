import { createApp } from 'vue';
import App from './App.vue';
import { getVRippleDirective } from './directives/v-ripple';
import { getVTapDirective } from './directives/v-tap';

updateCSSViewportHeight();

const app = createApp(App);
app.directive('ripple', getVRippleDirective());
app.directive('tap', getVTapDirective());
app.mount('#app');

// -----------------------------------------------------------------------------
// HELPERS
// -----------------------------------------------------------------------------

function updateCSSViewportHeight() {
  const vwHeight = visualViewport.height;
  document.documentElement.style.setProperty('--vwHeight', `${vwHeight}px`);
}
