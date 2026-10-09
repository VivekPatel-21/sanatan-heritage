import { readdir, readFile, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import sharp from 'sharp';
import { load } from 'cheerio';
import { minify as minifyHTML } from 'html-minifier-terser';
import CleanCSS from 'clean-css';
import { minify as minifyJS } from 'terser';
const origin = 'https://sanatan-heritage.vivopatel1304.chatgpt.site';
const run = args => { const result = spawnSync(process.execPath, args, { stdio: 'inherit' }); if (result.status !== 0) process.exit(result.status ?? 1); };
await rm('dist', { recursive: true, force: true });
run(['node_modules/@11ty/eleventy/cmd.cjs']);
const directory = 'dist/assets/images';
const images = new Map();
for (const name of await readdir('src/assets/images')) {
  const original = path.join('src/assets/images', name);
  const metadata = await sharp(original).metadata();
  if (name === 'og.png') { await sharp(original).png({ compressionLevel: 9 }).toFile(path.join(directory, name)); continue; }
  const outputName = name.replace(/\.(png|webp)$/, '.webp');
  const widths = [...new Set([480, 768, 1200, Math.min(metadata.width, 1600)].filter(width => width <= metadata.width))].sort((a,b) => a-b);
  const variants = [];
  for (const width of widths) {
    const largest = width === widths.at(-1);
    const variant = largest ? outputName : outputName.replace('.webp', `-${width}.webp`);
    const result = await sharp(original).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 82, effort: 5 }).toFile(path.join(directory, variant));
    variants.push({ path: `/assets/images/${variant}`, width: result.width, height: result.height });
  }
  images.set(`/assets/images/${name}`, variants);
  if (name !== outputName) await rm(path.join(directory, name));
}
const glossary = JSON.parse(await readFile('src/data/glossary.json', 'utf8'));
const aliases = glossary.flatMap(term => [...new Set([term.id, ...term.name.split(' · ')])].map(alias => ({ alias, id: term.id })));
const pages = (await readdir('dist')).filter(name => name.endsWith('.html')).sort();
for (const name of pages) {
  const $ = load(await readFile(`dist/${name}`, 'utf8'));
  $('.site-nav a').each((_, el) => { if ($(el).attr('href') === `/${name}`) $(el).attr('aria-current', 'page'); });
  $('img').each((_, el) => {
    const image = $(el); const variants = images.get(image.attr('src'));
    if (!variants) return;
    const largest = variants.at(-1);
    image.attr({ src: largest.path, width: String(largest.width), height: String(largest.height), decoding: 'async' });
    if (!image.closest('.hero,.tale-hero,.collection-hero,.scripture-hero,.lalita-hero').length) image.attr('loading', 'lazy');
    image.attr('srcset', variants.map(variant => `${variant.path} ${variant.width}w`).join(', '));
    image.attr('sizes', image.closest('.deity-card,.collection-card,.story-card').length ? '(max-width: 680px) 90vw, (max-width: 1050px) 45vw, 360px' : '(max-width: 760px) 100vw, 50vw');
  });
  if (!['glossary.html','sources.html','search.html','404.html'].includes(name)) {
    const used = new Set($('.glossary-link').toArray().map(el => $(el).attr('href')?.split('#')[1]));
    $('main p:not(.eyebrow):not(.collection-source)').each((_, el) => {
      const visit = node => {
        if (node.type === 'text') {
          let value = node.data; const matches = [];
          for (const {alias,id} of aliases) {
            if (used.has(id)) continue;
            const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`(?<![\\p{L}])${escaped}(?![\\p{L}])`, 'iu');
            const match = regex.exec(value);
            if (match) matches.push({ start: match.index, end: match.index + match[0].length, id, text: match[0] });
          }
          matches.sort((a,b) => a.start-b.start);
          let cursor=0; const fragments=[];
          for (const match of matches) {
            if (match.start < cursor || used.has(match.id)) continue;
            const span = $('<span>').text(value.slice(cursor,match.start)); fragments.push(span.html());
            fragments.push(`<a class="glossary-link" href="/glossary.html#${match.id}">${match.text}</a>`); used.add(match.id); cursor=match.end;
          }
          if (cursor) { fragments.push($('<span>').text(value.slice(cursor)).html()); $(node).replaceWith(fragments.join('')); }
        } else if (node.type === 'tag' && !['a','button','script','style'].includes(node.name)) [...(node.children ?? [])].forEach(visit);
      };
      [...el.children].forEach(visit);
    });
  }
  await writeFile(`dist/${name}`, await minifyHTML($.html(), { collapseWhitespace: true, removeComments: true, keepClosingSlash: false, removeRedundantAttributes: true }));
}
const css = new CleanCSS({ level: 1 }).minify(await readFile('src/assets/css/style.css','utf8'));
if (css.errors.length) throw new Error(css.errors.join('\n'));
await writeFile('dist/assets/css/style.css', css.styles);
for (const name of await readdir('src/assets/js')) {
  const result = await minifyJS(await readFile(`src/assets/js/${name}`, 'utf8'));
  await writeFile(`dist/assets/js/${name}`, result.code);
}
await writeFile('dist/sitemap.xml', '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+pages.filter(name => !['404.html','search.html'].includes(name)).map(name => `<url><loc>${origin}/${name === 'index.html' ? '' : name}</loc></url>`).join('')+'</urlset>\n');
run(['node_modules/pagefind/lib/runner/bin.cjs', '--site', 'dist']);
console.log(`Built ${pages.length} pages, responsive WebP images, minified assets and search index.`);
