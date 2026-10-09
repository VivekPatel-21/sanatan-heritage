import { readFile } from 'node:fs/promises';
export default async function (config) {
  config.addGlobalData('glossary', JSON.parse(await readFile('src/data/glossary.json', 'utf8')));
  config.addPassthroughCopy({ 'src/assets': 'assets', 'src/data': 'data', 'src/robots.txt': 'robots.txt' });
  return { dir: { input: 'src', output: 'dist', includes: '_includes' }, templateFormats: ['njk'], htmlTemplateEngine: 'njk' };
}
