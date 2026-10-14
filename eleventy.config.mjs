import { readFile } from 'node:fs/promises';
export default async function (config) {
  config.addGlobalData('glossary', JSON.parse(await readFile('src/data/glossary.json', 'utf8')));
  config.addGlobalData('journeys', JSON.parse(await readFile('src/data/journeys.json', 'utf8')));
  config.addGlobalData('storyCatalog', JSON.parse(await readFile('src/data/stories.json', 'utf8')));
  config.addFilter('sourceHref', value => {
    if (!value) return '/sources.html';
    if (value.startsWith('#')) return `/sources.html${value}`;
    return `/${value.replace(/^\/+/, '')}`;
  });
  config.addPassthroughCopy({ 'src/assets': 'assets', 'src/data': 'data', 'src/robots.txt': 'robots.txt' });
  return { dir: { input: 'src', output: 'dist', includes: '_includes' }, templateFormats: ['njk'], htmlTemplateEngine: 'njk' };
}
