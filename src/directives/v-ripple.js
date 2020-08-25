import Vue from 'vue';

Vue.directive('ripple', {
  bind(el) {
    el.style.overflow = 'hidden';
    el.style.position = 'relative';
    el.addEventListener('touchstart', (event) => applyRippleEffect(event, el));
  },
});

// -----------------------------------------------------------------------------
// HELPERS
// -----------------------------------------------------------------------------

function applyRippleEffect(event, elem) {
  const { top, left, width, height } = elem.getBoundingClientRect();

  let ripple = elem.querySelector('.ripple');
  if (!ripple) {
    ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.height = ripple.style.width = Math.max(width, height) + 'px';
    elem.appendChild(ripple);
  }

  ripple.classList.remove('show');

  const touchX = event.touches[0].pageX;
  const touchY = event.touches[0].pageY;

  const x = touchX - left - ripple.offsetWidth / 2 - document.body.scrollLeft;
  const y = touchY - top - ripple.offsetHeight / 2 - document.body.scrollTop;

  ripple.style.left = x + 'px';
  ripple.style.top = y + 'px';
  ripple.classList.add('show');

  return false;
}
