import { readFile } from 'node:fs/promises';
import {site,absoluteUrl,pagePath,socialPath,structuredData} from './scripts/site-config.mjs';
export default async function (config) {
  config.addGlobalData('site',site);
  config.addGlobalData('navigation',JSON.parse(await readFile('src/data/navigation.json','utf8')));
  config.addGlobalData('festivals',JSON.parse(await readFile('src/data/festivals.json','utf8')));
  config.addGlobalData('eleventyComputed',{
    canonical:data=>absoluteUrl(pagePath(data)),
    socialImage:data=>absoluteUrl(socialPath(data)),
    structuredData:data=>structuredData(data)
  });
  config.addFilter('absoluteUrl',absoluteUrl);
  config.addFilter('jsonScript',value=>JSON.stringify(value).replace(/</g,'\\u003c').replace(/>/g,'\\u003e').replace(/&/g,'\\u0026'));
  config.addGlobalData('glossary', JSON.parse(await readFile('src/data/glossary.json', 'utf8')));
  config.addGlobalData('journeys', JSON.parse(await readFile('src/data/journeys.json', 'utf8')));
  config.addGlobalData('storyCatalog', JSON.parse(await readFile('src/data/stories.json', 'utf8')));
  config.addFilter('sourceHref', value => {
    if (!value) return '/sources.html';
    if (value.startsWith('#')) return `/sources.html${value}`;
    return `/${value.replace(/^\/+/, '')}`;
  });
  config.addPassthroughCopy({ 'src/assets': 'assets', 'src/data': 'data' });
  return { dir: { input: 'src', output: 'dist', includes: '_includes' }, templateFormats: ['njk'], htmlTemplateEngine: 'njk' };
}
