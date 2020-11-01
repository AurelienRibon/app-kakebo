import { Directive } from 'vue';

export function getVTapDirective(): Directive {
  return {
    mounted(el: HTMLElement) {
      el.addEventListener('touchstart', () => {
        let moves = 0;
        const touchmoveListener = () => ++moves;

        document.addEventListener('touchmove', touchmoveListener);

        setTimeout(() => {
          document.removeEventListener('touchmove', touchmoveListener);
          if (moves === 0) {
            el.dispatchEvent(new Event('tap'));
          }
        }, 150);
      });
    },
  };
}
