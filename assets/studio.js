// Retain old catalogue fragment links even though the directory is now compact.
function revealDirectoryDestination() {
  let target;
  try { target = document.getElementById(decodeURIComponent(location.hash.slice(1))); } catch { return; }
  const directory = target?.closest('.studio-directory');
  if (!directory) return;
  directory.open = true;
  target.scrollIntoView({block: 'start', behavior: 'instant'});
}
window.addEventListener('hashchange', revealDirectoryDestination);
revealDirectoryDestination();

// The public feature reads the same edition inventory as the app shelf.
fetch('/tone_sovereign/comic-editions.json').then(response => {
  if (!response.ok) throw new Error('Edition inventory unavailable');
  return response.json();
}).then(manifest => {
  const edition = manifest.editions?.find(item => item.id === 'specials-1-en');
  if (!edition?.hasSeparateCover || !Number.isInteger(edition.storyPageCount)) return;
  const detail = document.querySelector('.studio-story .studio-meta');
  if (detail) detail.textContent = `${edition.storyPageCount} story pages + cover · Exact page transcripts · Adjustable reading size`;
}).catch(() => {}); // Static, verified copy remains usable without JavaScript/network.
