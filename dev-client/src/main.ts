import { createApp } from 'vue';
import { Plugins } from '@capacitor/core';
import { store } from './store/store';
import { getVRippleDirective } from './directives/v-ripple';
import { getVTapDirective } from './directives/v-tap';
import App from './components/App.vue';
import './main.scss';

setup();
updateCSSViewportHeight();

const app = createApp(App);
app.directive('ripple', getVRippleDirective());
app.directive('tap', getVTapDirective());
app.mount('#app');

// -----------------------------------------------------------------------------
// SETUP
// -----------------------------------------------------------------------------

async function setup() {
  const info = await Plugins.Device.getInfo();
  return info.platform === 'web' ? setupPlatformWeb() : setupPlatformMobile();
}

function setupPlatformWeb() {
  store.loadAndSync();
}

function setupPlatformMobile() {
  store.loadAndSync();

  Plugins.Keyboard.setAccessoryBarVisible({ isVisible: true });

  Plugins.App.addListener('appStateChange', (state) => {
    if (state.isActive) {
      store.loadAndSync();
    }
  });
}

// -----------------------------------------------------------------------------
// HELPERS
// -----------------------------------------------------------------------------

function updateCSSViewportHeight() {
  const h = visualViewport.height;
  document.documentElement.style.setProperty('--h', `${h}px`);
}
