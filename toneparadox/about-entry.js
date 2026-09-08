(() => {
  if (new URLSearchParams(window.location.search).get('open') !== 'about') return;
  window.addEventListener('load', () => {
    const button = document.getElementById('landingAboutButton');
    if (button instanceof HTMLButtonElement) button.click();
  }, { once: true });
})();
