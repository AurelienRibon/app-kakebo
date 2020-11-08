import { Directive } from 'vue';

export function getVAutofocusDirective(): Directive {
  return {
    mounted(el: HTMLElement) {
      el.focus();
    },
  };
}
