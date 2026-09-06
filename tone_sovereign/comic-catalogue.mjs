// Additional published collections reuse the archive's exact files. No image
// copies or inferred transcripts, and no changes to historical issue variants.
export function additionalComicSeries(manifest) {
  if (manifest?.version !== 1 || !Array.isArray(manifest.editions)) return [];
  if (!Array.isArray(manifest.extraCollections)) return [];
  return manifest.extraCollections.flatMap(collection => {
    if (!collection || typeof collection.id !== 'string' || !/^[a-z][a-z0-9-]*$/.test(collection.id)
      || !['practice-books', 'archive'].includes(collection.kind) || !Array.isArray(collection.issueNumbers)
      || !collection.issueNumbers.every(number => Number.isSafeInteger(number) && number > 0)
      || new Set(collection.issueNumbers).size !== collection.issueNumbers.length
      || !['en', 'es'].every(language => typeof collection[language]?.title === 'string' && typeof collection[language]?.subtitle === 'string')) return [];
    const safePath = path => {
      if (typeof path !== 'string' || !path.startsWith('/tone_comics/assets/')) return false;
      try {
        const decoded = decodeURIComponent(path);
        return decoded.startsWith('/tone_comics/assets/') && !/[\\?#&"'\x00-\x1f]/.test(decoded) && !/(^|\/)\.{1,2}(\/|$)/.test(decoded);
      } catch { return false; }
    };
    const issues = collection.issueNumbers.flatMap(number => {
      const find = language => manifest.editions.find(entry => entry.series === collection.id && entry.issue === number && entry.language === language);
      const en = find('en'), es = find('es');
      const valid = entry => entry && typeof entry.title === 'string' && typeof entry.hasSeparateCover === 'boolean'
        && Number.isSafeInteger(entry.imageCount) && Array.isArray(entry.paths) && entry.paths.length > Number(entry.hasSeparateCover) && entry.paths.length === entry.imageCount
        && entry.paths.every(safePath);
      if (!valid(en) || !valid(es) || en.imageCount !== es.imageCount || en.hasSeparateCover !== es.hasSeparateCover) return [];
      const assets = entry => entry.hasSeparateCover ? {cover: entry.paths[0], pages: entry.paths.slice(1)} : {pages: entry.paths};
      return [{id: `${collection.id}-${number}`, number, pages: en.imageCount - Number(en.hasSeparateCover), hasCover: en.hasSeparateCover,
        en: en.title, es: es.title, published: true, assetReady: true, esReady: true,
        assets: {en: assets(en), es: assets(es)}}];
    });
    return issues.length ? [{id: collection.id, kind: collection.kind, en: collection.en, es: collection.es, issues}] : [];
  });
}
