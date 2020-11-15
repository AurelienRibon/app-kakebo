import type { DefineComponent } from 'vue';

declare module '*.vue' {
  const component: DefineComponent<{}, {}, any>; // eslint-disable-line
  export default component;
}
