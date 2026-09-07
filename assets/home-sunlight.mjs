// Progressive enhancement only. No video, audio, storage or external services.
export function sunlightState({ready, reduced, wanted, visible, foreground}) {
  if (!ready || reduced) return 'off';
  return wanted && visible && foreground ? 'running' : 'paused';
}

export function mountSunlight(root, button) {
  const image = root.querySelector('img');
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  let ready = false, wanted = true, visible = false, disposed = false;
  function update() {
    const mode = sunlightState({ready, reduced:preference.matches, wanted, visible, foreground:!document.hidden});
    if (mode === 'off') delete root.dataset.motion;
    else root.dataset.motion = mode;
    button.hidden = !ready || preference.matches;
    button.textContent = wanted ? 'Pause sunlight' : 'Play sunlight';
  }
  const toggle = () => { wanted = !wanted; update(); };
  const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; update(); }, {threshold:0});
  observer.observe(root);
  button.addEventListener('click', toggle);
  preference.addEventListener('change', update);
  document.addEventListener('visibilitychange', update);
  window.addEventListener('pageshow', update);
  const onPageHide = event => { if (!event.persisted) dispose(); };
  window.addEventListener('pagehide', onPageHide);
  function dispose() {
    disposed = true; observer.disconnect(); delete root.dataset.motion;
    button.hidden = true; button.removeEventListener('click', toggle);
    preference.removeEventListener('change', update);
    document.removeEventListener('visibilitychange', update);
    window.removeEventListener('pageshow', update);
    window.removeEventListener('pagehide', onPageHide);
  }
  image.decode().then(() => { if (!disposed) { ready = image.naturalWidth > 0; update(); } }).catch(() => {});
  update();
  return dispose;
}

if (typeof document !== 'undefined') {
  const root = document.querySelector('[data-sunrise]');
  const button = document.querySelector('[data-sunlight-toggle]');
  if (root && button && 'IntersectionObserver' in window) mountSunlight(root, button);
}
