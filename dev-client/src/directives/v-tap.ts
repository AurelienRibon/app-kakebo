import { Directive } from 'vue';

export function getVTapDirective(): Directive {
  return {
    mounted(el: HTMLElement) {
      el.addEventListener('touchstart', () => {
        const startTime = Date.now();

        const touchendListener = () => {
          el.removeEventListener('touchend', touchendListener);

          if (Date.now() - startTime < 200) {
            el.dispatchEvent(new Event('tap'));
          }
        };

        el.addEventListener('touchend', touchendListener);
      });
    },
  };
}
