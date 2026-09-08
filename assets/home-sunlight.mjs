// Continuous light only: the illustration remains still. Tap the artwork to pause.
// No video, audio, storage or external services.
export function mountSunlight(root) {
  const image = root.querySelector('img');
  const surface = root.querySelector('[data-sunlight-surface]');
  if (!image || !surface) return () => {};
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  let ready = false, visible = false, wanted = true, suspended = false, disposed = false;
  function update() {
    if (disposed) return;
    const allowed = ready && !preference.matches;
    if (!allowed) delete root.dataset.motion;
    else root.dataset.motion = wanted && visible && !document.hidden && !suspended ? 'running' : 'paused';
    surface.hidden = !allowed;
    const label = wanted ? 'Pause sunlight animation' : 'Resume sunlight animation';
    surface.setAttribute('aria-label', label);
    surface.title = label;
    surface.querySelector('.cn-motion-hint').textContent = wanted ? 'Ⅱ' : '▶';
  }
  const toggle = () => { wanted = !wanted; update(); };
  const observer = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    update();
  }, {threshold:0});
  const onPageHide = event => { suspended = true; update(); if (!event.persisted) dispose(); };
  const onPageShow = () => { suspended = false; update(); };
  observer.observe(root);
  surface.addEventListener('click', toggle);
  preference.addEventListener('change', update);
  document.addEventListener('visibilitychange', update);
  window.addEventListener('pagehide', onPageHide);
  window.addEventListener('pageshow', onPageShow);
  function dispose() {
    disposed = true;
    delete root.dataset.motion;
    surface.hidden = true;
    observer.disconnect();
    surface.removeEventListener('click', toggle);
    preference.removeEventListener('change', update);
    document.removeEventListener('visibilitychange', update);
    window.removeEventListener('pagehide', onPageHide);
    window.removeEventListener('pageshow', onPageShow);
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
