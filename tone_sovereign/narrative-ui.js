import {narrativeMetadata as metadata} from './narrative-metadata.js?v=20260915-seven-stories';
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
export const livedExperience = metadata.livedExperience;
export function homeIllustration(language, enabled) {
  if (!enabled) return '';
  const asset = metadata.assets.find(item => item.nativeCase === 'homeWide');
  return `<figure class="home-city-still"><img src="../assets/studio-sovereign-960.jpg" srcset="../assets/studio-sovereign-640.jpg 640w, ../assets/studio-sovereign-960.jpg 960w, ./assets/stills/home-city-five-doors-wide-1536.webp 1536w" sizes="(max-width: 620px) calc(100vw - 36px), (max-width: 1064px) calc(100vw - 104px), 960px" width="1536" height="1024" alt="${escape(asset.alt[language])}" decoding="async"></figure>`;
}
export function stageIllustration(movement, stage, language, enabled, answered, expanded = !answered) {
  if (!enabled) return '';
  const scene = metadata.stageStories.find(item => item.movement === movement && item.stageIndex === stage);
  const asset = metadata.assets.find(item => item.id === scene?.illustrationID);
  if (!asset?.webSources?.length) return '';
  const file = asset.webSources[0];
  const filename = file.path.split('/').at(-1);
  const largeFilename = filename.replace(/-480\.jpg$/, '-960.webp');
  const sources = /-480\.jpg$/.test(filename) ? ` srcset="./assets/stills/${escape(filename)} 480w, ./assets/stills/${escape(largeFilename)} 960w" sizes="(max-width: 620px) calc(100vw - 36px), (max-width: 959px) 584px, 460px"` : '';
  return `<details class="practice-story" data-story-key="${movement}-${stage}" ${expanded ? 'open' : ''}><summary><span>${escape(scene.eyebrow[language])}</span><small>${language === 'es' ? 'Ilustración opcional' : 'Optional illustration'}</small></summary><figure><img src="./assets/stills/${escape(filename)}"${sources} width="${file.width}" height="${file.height}" alt="${escape(asset.alt[language])}" decoding="async"><figcaption>${escape(scene.caption[language])}</figcaption></figure></details>`;
}

const bi = (en, es) => ({en, es});
const noticeScenes = [
  {file: 'notice-01-arrival.jpg', width: 960, height: 1314, title: bi('The street keeps arriving', 'La calle sigue llegando'), caption: bi('Rain, voices, light. For a moment, he pauses.', 'Lluvia, voces, luz. Por un momento, se detiene.'), alt: bi('A young man in a blue jacket stands with both feet on a wet pavement beside a stone bench. People with umbrellas pass between a warm shop window and a tram.', 'Un joven con chaqueta azul está de pie, con ambos pies apoyados en la acera mojada, junto a un banco de piedra. Personas con paraguas pasan entre un escaparate iluminado y un tranvía.')},
  {file: 'notice-02-one-signal.jpg', width: 960, height: 1200, title: bi('One point of contact', 'Un punto de contacto'), caption: bi('A hand on stone. Feet on the ground. A drop reaches the puddle.', 'Una mano sobre la piedra. Los pies en el suelo. Una gota llega al charco.'), alt: bi('The same man rests one open hand on the stone bench and looks towards it. His feet stay planted while drops from the gutter ripple a nearby puddle.', 'El mismo joven apoya una mano abierta en el banco de piedra y dirige la mirada hacia ella. Mantiene los pies apoyados mientras las gotas del canalón forman ondas en un charco cercano.')},
  {file: 'notice-03-wider-field.jpg', width: 960, height: 1200, title: bi('Room for what arrives', 'Espacio para lo que llega'), caption: bi('He looks up. Rain, light and other people are still here. Thoughts may be here too.', 'Levanta la mirada. La lluvia, la luz y las demás personas siguen aquí. Puede que también haya pensamientos.'), alt: bi('Still touching the bench, the man lifts his gaze to the rainy street. A wider view includes umbrella holders, people talking, a seated person inside the shop and the same tram.', 'Sin dejar de tocar el banco, el joven levanta la mirada hacia la calle lluviosa. La vista más amplia incluye personas con paraguas, gente conversando, una persona sentada dentro del local y el mismo tranvía.')}
];

const reclaimScenes = [
  ['reclaim.borrowedVoices', bi('Several voices arrive around an unfinished letter. Their presence does not decide what happens next.', 'Varias voces llegan alrededor de una carta sin terminar. Su presencia no decide lo que ocurre después.')],
  ['reclaim.everyVoiceMaySpeak', bi('She makes room to listen. Hearing a voice does not require obeying it.', 'Ella abre espacio para escuchar. Oír una voz no obliga a obedecerla.')],
  ['reclaim.centreRemainsOpen', bi('The chair remains open. The voices stay distinct, and none occupies the centre alone.', 'La silla permanece libre. Las voces siguen siendo distintas y ninguna ocupa el centro por sí sola.')],
  ['reclaim.authoritySelected', bi('One considered response takes form. The other voices are still allowed to be present.', 'Una respuesta considerada toma forma. Las otras voces pueden seguir presentes.')],
  ['reclaim.returnWithChoice', bi('The letter can remain unfinished. She can return to life with a choice of her own.', 'La carta puede quedar sin terminar. Ella puede volver a la vida con una elección propia.')]
];

function nativeFigure(id, caption, language) {
  const asset = metadata.assets.find(item => item.id === id);
  if (!asset) return '';
  const filename = asset.nativeResource.split('/').at(-1);
  return `<figure><img src="./assets/illustrations/${escape(filename)}" width="${asset.width}" height="${asset.height}" alt="${escape(asset.alt[language])}" decoding="async" loading="lazy">${caption ? `<figcaption>${escape(caption[language])}</figcaption>` : ''}</figure>`;
}

function optionalScene(key, label, content, language, expanded = false, extraClass = '') {
  return `<details class="practice-story ${extraClass}" data-story-key="${escape(key)}" ${expanded ? 'open' : ''}><summary><span>${escape(label[language])}</span><small>${language === 'es' ? 'Ilustración opcional' : 'Optional illustration'}</small></summary>${content}</details>`;
}

export function noticeStory(language, enabled, expanded = false) {
  if (!enabled) return '';
  const content = `<p class="story-introduction">${language === 'es' ? 'Un ejemplo cotidiano antes de comenzar. Puedes volver a la práctica cuando quieras.' : 'One everyday example before you begin. Return to the practice whenever you wish.'}</p><ol class="notice-story-sequence">${noticeScenes.map(scene => `<li><figure><img src="./assets/illustrations/${scene.file}" width="${scene.width}" height="${scene.height}" alt="${escape(scene.alt[language])}" decoding="async" loading="lazy"><figcaption><strong>${escape(scene.title[language])}</strong>${escape(scene.caption[language])}</figcaption></figure></li>`).join('')}</ol><a class="story-return-link" href="#notice-begin">${language === 'es' ? 'Volver a Comenzar' : 'Return to Begin'} ↑</a>`;
  return optionalScene('notice-example', bi('A moment in the street', 'Un momento en la calle'), content, language, expanded, 'practice-story-sequence');
}

export function reclaimIllustration(stage, language, enabled, expanded = false, key = `reclaim-${stage}`) {
  if (!enabled || !reclaimScenes[stage]) return '';
  const [id, caption] = reclaimScenes[stage];
  return optionalScene(key, bi('An open council', 'Un consejo abierto'), nativeFigure(id, caption, language), language, expanded);
}

export function capacityArrivalIllustration(movement, language, enabled, expanded = false) {
  if (!enabled || !['stabilise', 'cross', 'embody'].includes(movement)) return '';
  const captions = {
    stabilise: bi('The weather need not disappear for a supported place to become available.', 'No hace falta que desaparezca la tormenta para encontrar un lugar donde apoyarse.'),
    cross: bi('The paths remain equally open. Crossing, remaining and returning are all possible.', 'Los caminos siguen igualmente abiertos. Cruzar, quedarse y volver son posibilidades válidas.'),
    embody: bi('A chosen tone takes a felt form in an ordinary moment.', 'Un tono elegido toma una forma sentida en un momento cotidiano.')
  };
  return optionalScene(`${movement}-arrival`, bi('A way into the practice', 'Una entrada a la práctica'), nativeFigure(`capacity.${movement}`, captions[movement], language), language, expanded);
}

export function crossReturnIllustration(language, enabled, expanded = false) {
  if (!enabled) return '';
  const caption = bi('The paths remain open. He can stay, return or take a step.', 'Los caminos siguen abiertos. Puede quedarse, volver o dar un paso.');
  const alt = bi('A man in a blue jacket stands with both feet on a circular garden junction. Three warmly lit paths and a nearby bench remain available.', 'Un hombre con chaqueta azul está de pie, con ambos pies apoyados en un cruce circular de jardín. Siguen disponibles tres caminos con luz cálida y un banco cercano.');
  const content = `<figure><img src="./assets/illustrations/cross-return-with-room.jpg" width="960" height="1200" alt="${escape(alt[language])}" decoding="async" loading="lazy"><figcaption>${escape(caption[language])}</figcaption></figure>`;
  return optionalScene('cross-return', bi('Room to choose', 'Espacio para elegir'), content, language, expanded);
}
export function completionStory(movement) {
  const link = metadata.completionLinks.find(item => item.movement === movement);
  if (!link) return null;
  return {...link, webSeries: link.comicIssueID.series === 'innerAdversaries' ? 'hall' : link.comicIssueID.series};
}
