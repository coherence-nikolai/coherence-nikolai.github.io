import {readFile, writeFile, stat, mkdir} from 'node:fs/promises';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import vm from 'node:vm';
const require = createRequire(import.meta.url);
const sharp = require(process.env.TONE_SHARP_MODULE || 'sharp');
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = await readFile(resolve(root, 'app.js'), 'utf8');
const previousManifest = JSON.parse(await readFile(resolve(root, 'comic-editions.json'), 'utf8'));
// This generator owns the original app collections. Archive editions use
// verified existing paths and keep their independent edition provenance.
const context = vm.createContext({ROOT: './', state: {lang: 'en'}, phrase: en => en, additionalComicSeries: () => [], comicManifest: previousManifest});
vm.runInContext(source.slice(source.indexOf('const THE_LOCK_EDITION'), source.indexOf('const movements')), context);
vm.runInContext(source.slice(source.indexOf('function comicImageCount('), source.indexOf('function comicImageAlt(')), context);
const series = vm.runInContext('comicSeries', context);
const editions = [];
for (const shelf of series) for (const issue of shelf.issues) {
  if (issue.published === false || issue.assetReady === false) continue;
  for (const language of ['en', 'es']) {
    if (language === 'es' && !issue.esReady) continue;
    context.issue = issue; context.seriesID = shelf.id; context.language = language;
    const paths = vm.runInContext('Array.from({length: comicImageCount(issue)}, (_, i) => comicAssetPath(seriesID, issue, i + 1, language))', context);
    let bytes = 0;
    for (const path of paths) bytes += (await stat(resolve(root, path.split('?')[0]))).size;
    const thumbnail = `./assets/comics/shelves/ink-v4/${language}/${shelf.id}-${issue.number}.webp`;
    await mkdir(dirname(resolve(root, thumbnail)), {recursive: true});
    await sharp(resolve(root, paths[0].split('?')[0])).resize({width: 320, withoutEnlargement: true}).webp({quality: 88}).toFile(resolve(root, thumbnail));
    const transcript = issue.transcriptPaths?.[language] || null;
    if (transcript) await stat(resolve(root, transcript.split('?')[0]));
    editions.push({id: `${shelf.id}-${issue.number}-${language}`, series: shelf.id, issue: issue.number, language, title: issue[language], imageCount: paths.length, hasSeparateCover: Boolean(issue.hasCover), storyPageCount: issue.hasCover ? issue.pages : null, countConvention: issue.hasCover ? 'story-pages-plus-cover' : 'total-images', paths, bytes, thumbnail, thumbnailBytes: (await stat(resolve(root, thumbnail))).size, transcript});
  }
}
const extraCollections = previousManifest.extraCollections || [];
editions.push(...previousManifest.editions.filter(entry => extraCollections.some(collection => collection.id === entry.series)));
await writeFile(resolve(root, 'comic-editions.json'), JSON.stringify({version: 1, source: 'Tone Sovereign published reader catalogue', editions, extraCollections}, null, 2) + '\n');
console.log({editions: editions.length, images: editions.reduce((sum, e) => sum + e.imageCount, 0), thumbnailBytes: editions.reduce((sum, e) => sum + e.thumbnailBytes, 0)});
