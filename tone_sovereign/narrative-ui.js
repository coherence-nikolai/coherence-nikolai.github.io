import {narrativeMetadata as metadata} from './narrative-metadata.js';
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
  const sources = /-480\.jpg$/.test(filename) ? ` srcset="./assets/stills/${escape(filename)} 480w, ./assets/stills/${escape(largeFilename)} 960w" sizes="(max-width: 620px) calc(100vw - 36px), 560px"` : '';
  return `<details class="practice-story" ${expanded ? 'open' : ''}><summary>${escape(answered ? metadata.policy.reviewLabel[language] : scene.eyebrow[language])}</summary><figure><img src="./assets/stills/${escape(filename)}"${sources} width="${file.width}" height="${file.height}" alt="${escape(asset.alt[language])}" decoding="async"><figcaption>${escape(scene.caption[language])}</figcaption></figure></details>`;
}
export function completionStory(movement) {
  const link = metadata.completionLinks.find(item => item.movement === movement);
  if (!link) return null;
  return {...link, webSeries: link.comicIssueID.series === 'innerAdversaries' ? 'hall' : link.comicIssueID.series};
}
