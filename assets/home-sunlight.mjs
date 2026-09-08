// Progressive enhancement: one short shimmer over an always-visible light layer.
// No video, audio, storage, controls or external services.
export function mountSunlight(root) {
  const image = root.querySelector('img');
  const light = root.querySelector('.cn-sunlight');
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  let ready = false, visible = false, started = false, settled = false, disposed = false;
  let finishTimer;
  function settle() {
    settled = true;
    clearTimeout(finishTimer);
    delete root.dataset.motion;
  }
  function update() {
    if (disposed) return;
    if (preference.matches || document.hidden || (started && !visible)) {
      settle();
    } else if (ready && visible && !started && !settled) {
      started = true;
      root.dataset.motion = 'running';
      finishTimer = setTimeout(settle, 4100);
    }
  }
  const observer = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    update();
  }, {threshold:0});
  const onAnimationEnd = event => { if (event.animationName === 'cn-sunlight-arrival') settle(); };
  const onPageHide = event => { settle(); if (!event.persisted) dispose(); };
  observer.observe(root);
  light.addEventListener('animationend', onAnimationEnd);
  preference.addEventListener('change', update);
  document.addEventListener('visibilitychange', update);
  window.addEventListener('pagehide', onPageHide);
  function dispose() {
    disposed = true;
    settle();
    observer.disconnect();
    light.removeEventListener('animationend', onAnimationEnd);
    preference.removeEventListener('change', update);
    document.removeEventListener('visibilitychange', update);
    window.removeEventListener('pagehide', onPageHide);
  }
  image.decode().then(() => {
    if (!disposed) { ready = image.naturalWidth > 0; update(); }
  }).catch(() => {});
  update();
  return dispose;
}

if (typeof document !== 'undefined') {
  const root = document.querySelector('[data-sunrise]');
  if (root && 'IntersectionObserver' in window) mountSunlight(root);
}
