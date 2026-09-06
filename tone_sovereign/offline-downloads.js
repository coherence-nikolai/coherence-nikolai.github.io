// Optional public audio only. Never stores, uploads or removes practice responses.
export const MEDIA_CACHE = 'tone-sovereign-media-v1';
let activeController = null;
let mediaQueue = Promise.resolve();
function queueMediaWork(work) {
  const next = mediaQueue.then(() => navigator.locks?.request
    ? navigator.locks.request('tone-sovereign:offline-media', {mode: 'exclusive'}, work)
    : work());
  mediaQueue = next.catch(() => {});
  return next;
}
export function cancelOfflineDownloads() { activeController?.abort(); activeController = null; }
export async function cachedAudioValid(cache, url, file) {
  const response = await cache.match(url);
  if (!response?.ok || !/^audio\//i.test(response.headers.get('Content-Type') || '')) return false;
  return (await response.blob()).size === file.bytes;
}
export function validatePacks(manifest) {
  if (manifest?.version !== 1 || !Array.isArray(manifest.packs)) throw new Error('Invalid pack manifest');
  const ids = new Set();
  for (const pack of manifest.packs) {
    if (!/^(en|es)-(practice|sits)$|^first-light$/.test(pack.id) || ids.has(pack.id) || !Array.isArray(pack.files) || !pack.files.length) throw new Error('Invalid pack');
    ids.add(pack.id);
    const paths = new Set();
    for (const file of pack.files) {
      if (!/^\.\/assets\/(voice\/(en|es)\/ts_[a-z0-9_]+\.mp3|sound\/ts_first_light_[a-z0-9_]+\.wav)$/.test(file.path) || !Number.isSafeInteger(file.bytes) || file.bytes <= 0 || paths.has(file.path)) throw new Error('Invalid audio file');
      paths.add(file.path);
    }
    if (pack.bytes !== pack.files.reduce((sum, file) => sum + file.bytes, 0)) throw new Error('Incorrect pack size');
  }
  return manifest.packs;
}
export async function mountOfflineDownloads(container, language) {
  cancelOfflineDownloads();
  const controller = new AbortController();
  activeController = controller;
  const text = (en, es) => language === 'es' ? es : en;
  const live = () => container.isConnected && !controller.signal.aborted;
  if (!('caches' in window) || !('serviceWorker' in navigator)) {
    container.textContent = text('Offline downloads are unavailable in this browser. You can still practise online.', 'Las descargas sin conexión no están disponibles en este navegador. Puedes practicar en línea.');
    return;
  }
  try {
    const response = await fetch('./offline-packs.json', {signal: controller.signal});
    if (!response.ok) throw new Error('Pack list unavailable');
    const packs = validatePacks(await response.json());
    await mediaQueue; // An interrupted removal must finish before a new view can download.
    const cache = await caches.open(MEDIA_CACHE);
    if (!live()) return;
    const intro = document.createElement('p');
    intro.className = 'gentle-note';
    intro.textContent = navigator.serviceWorker.controller
      ? text('Offline support is active. Download only the voices or arrival sound you want. Images and complete books are not included in these packs. Test the app offline before relying on it away from a connection.', 'El soporte sin conexión está activo. Descarga solo las voces o el sonido de llegada que quieras. Estos paquetes no incluyen imágenes ni libros completos. Prueba la aplicación sin conexión antes de depender de ella lejos de una conexión.')
      : text('The offline practice shell is not ready yet. Reopen the app online after installation; these packs alone do not install the app.', 'La base de práctica sin conexión aún no está lista. Abre de nuevo la aplicación en línea tras la instalación; estos paquetes por sí solos no instalan la aplicación.');
    container.replaceChildren(intro);
    let busy = false;
    const rows = [];
    for (const pack of packs) {
      const row = document.createElement('section'); row.className = 'offline-pack';
      const title = document.createElement('h2');
      const kind = pack.kind === 'practice' ? text('Practice invitations', 'Invitaciones de práctica') : pack.kind === 'sits' ? text('Guided Sits', 'Meditaciones guiadas') : text('First Light sound', 'Sonido de Primera Luz');
      title.textContent = `${kind}${pack.language ? ` · ${pack.language === 'en' ? 'English' : 'Español'}` : ''}`;
      const status = document.createElement('p'); status.setAttribute('role', 'status');
      const actions = document.createElement('div'); actions.className = 'button-row';
      const download = document.createElement('button'); download.type = 'button'; download.className = 'secondary-button';
      download.textContent = `${text('Download', 'Descargar')} · ${(pack.bytes / 1048576).toFixed(1)} MiB`;
      const remove = document.createElement('button'); remove.type = 'button'; remove.className = 'text-button'; remove.textContent = text('Remove downloaded audio', 'Borrar audio descargado');
      const urls = pack.files.map(file => new URL(file.path, location.href).href);
      const refresh = async () => {
        try {
          let count = 0; let present = 0;
          for (let index = 0; index < urls.length; index++) {
            if (!live()) return;
            if (await cache.match(urls[index])) present++;
            if (await cachedAudioValid(cache, urls[index], pack.files[index])) count++;
          }
          if (!live()) return;
          status.textContent = count === urls.length ? text('Ready offline', 'Disponible sin conexión') : count ? text(`${count} of ${urls.length} files downloaded. Resume to finish.`, `${count} de ${urls.length} archivos descargados. Reanuda para terminar.`) : text('Not downloaded or needs repair', 'Sin descargar o necesita reparación');
          download.disabled = busy || count === urls.length; remove.disabled = busy || !present;
        } catch {
          if (!live()) return;
          status.textContent = text('Download status could not be checked. Try again; no readiness is being assumed.', 'No se pudo comprobar la descarga. Inténtalo de nuevo; no se da por hecho que esté disponible.');
          download.disabled = busy; remove.disabled = busy;
        }
      };
      const setBusy = value => { busy = value; rows.forEach(item => { item.download.disabled = value; item.remove.disabled = value; }); };
      download.addEventListener('click', async () => {
        if (busy || !live()) return; setBusy(true);
        try {
          await queueMediaWork(async () => {
          for (let index = 0; index < urls.length; index++) {
            if (!live()) return;
            if (!(await cachedAudioValid(cache, urls[index], pack.files[index]))) {
              // The service worker is cache-first: evict an invalid response so
              // this repair reaches the network instead of replaying bad bytes.
              await cache.delete(urls[index]);
              if (!live()) return;
              const audio = await fetch(urls[index], {signal: controller.signal});
              if (!audio.ok || !/^audio\//i.test(audio.headers.get('Content-Type') || '')) throw new Error('Audio unavailable');
              const blob = await audio.blob();
              if (blob.size !== pack.files[index].bytes) throw new Error('Incomplete audio');
              if (!live()) return;
              await cache.put(urls[index], new Response(blob, {headers: {'Content-Type': pack.files[index].path.endsWith('.mp3') ? 'audio/mpeg' : 'audio/wav'}}));
            }
            if (live()) status.textContent = text(`Downloading ${index + 1} of ${urls.length}…`, `Descargando ${index + 1} de ${urls.length}…`);
          }
          });
          setBusy(false); await Promise.all(rows.map(item => item.refresh()));
        } catch {
          setBusy(false); await Promise.all(rows.map(item => item.refresh()));
          if (live()) status.textContent = text('Download did not finish. Check connection or free space, then resume. Completed files are retained.', 'La descarga no terminó. Revisa la conexión o el espacio libre y reanuda. Los archivos completos se conservan.');
        }
      });
      remove.addEventListener('click', async () => {
        if (busy || !live()) return; setBusy(true);
        let failed = false;
        try { await queueMediaWork(async () => {
          for (const url of urls) {
            if (!live()) return;
            await cache.delete(url);
          }
        }); }
        catch { failed = true; }
        finally {
          setBusy(false); await Promise.all(rows.map(item => item.refresh()));
          if (failed && live()) status.textContent = text('Some audio could not be removed. Try again.', 'No se pudo borrar parte del audio. Inténtalo de nuevo.');
        }
      });
      actions.append(download, remove); row.append(title, status, actions); container.append(row);
      rows.push({download, remove, refresh}); await refresh();
    }
  } catch {
    if (live()) container.textContent = text('The download list is unavailable. Reconnect and try again. No practice data has been changed.', 'La lista de descargas no está disponible. Vuelve a conectarte e inténtalo de nuevo. No se han cambiado tus datos de práctica.');
  }
}
