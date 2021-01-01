import { createApp } from 'vue';
import { Plugins } from '@capacitor/core';
import { getVAutofocusDirective } from './directives/v-autofocus';
import { getVRippleDirective } from './directives/v-ripple';
import { getVTapDirective } from './directives/v-tap';
import App from './components/App.vue';
import './main.scss';

Plugins.Keyboard.setAccessoryBarVisible({ isVisible: true });

updateCSSViewportHeight();

const app = createApp(App);
app.directive('autofocus', getVAutofocusDirective());
app.directive('ripple', getVRippleDirective());
app.directive('tap', getVTapDirective());
app.mount('#app');

// -----------------------------------------------------------------------------
// HELPERS
// -----------------------------------------------------------------------------

function updateCSSViewportHeight() {
  const h = visualViewport.height;
  document.documentElement.style.setProperty('--h', `${h}px`);
}
