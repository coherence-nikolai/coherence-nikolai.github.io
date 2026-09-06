import {readFile, writeFile, stat} from 'node:fs/promises';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = await readFile(resolve(root, 'sw.js'), 'utf8');
const context = vm.createContext({});
vm.runInContext(source.slice(0, source.indexOf('const CORE')), context);
const practice = vm.runInContext('VOICE_CUES', context);
const sits = vm.runInContext('GUIDED_SIT_VOICE_CUES', context);
const packs = [];
for (const language of ['en', 'es']) {
  for (const [kind, cues] of [['practice', practice], ['sits', sits]]) {
    const files = await Promise.all(cues.map(async cue => {
      const path = `./assets/voice/${language}/${cue}.mp3`;
      return {path, bytes: (await stat(resolve(root, path))).size};
    }));
    packs.push({id: `${language}-${kind}`, language, kind, bytes: files.reduce((sum, file) => sum + file.bytes, 0), files});
  }
}
const files = await Promise.all(['ts_first_light_arrival_full.wav', 'ts_first_light_living_ambience.wav'].map(async name => {
  const path = `./assets/sound/${name}`;
  return {path, bytes: (await stat(resolve(root, path))).size};
}));
packs.push({id: 'first-light', language: null, kind: 'first-light', bytes: files.reduce((sum, file) => sum + file.bytes, 0), files});
await writeFile(resolve(root, 'offline-packs.json'), JSON.stringify({version: 1, packs}, null, 2) + '\n');
console.log(packs.map(({id, bytes, files}) => ({id, bytes, files: files.length})));
