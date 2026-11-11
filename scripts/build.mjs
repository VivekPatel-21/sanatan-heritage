import { readdir, readFile, writeFile, rm, mkdir, copyFile } from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import sharp from 'sharp';
import { load } from 'cheerio';
import { minify as minifyHTML } from 'html-minifier-terser';
import CleanCSS from 'clean-css';
import { minify as minifyJS } from 'terser';
import {site} from './site-config.mjs';
const origin=site.origin;
const run = args => { const result = spawnSync(process.execPath, args, { stdio: 'inherit' }); if (result.status !== 0) process.exit(result.status ?? 1); };
await rm('dist', { recursive: true, force: true });
run(['node_modules/@11ty/eleventy/cmd.cjs']);
await mkdir('dist/assets/vendor', { recursive:true });
for (const name of ['three.module.js','three.core.js']) await copyFile('node_modules/three/build/'+name,'dist/assets/vendor/'+name);
await copyFile('node_modules/gsap/dist/gsap.min.js','dist/assets/vendor/gsap.min.js');
await copyFile('node_modules/three/LICENSE','dist/assets/vendor/THREE-LICENSE.txt');
await copyFile('node_modules/gsap/README.md','dist/assets/vendor/GSAP-NOTICE.md');
const directory = 'dist/assets/images';
const images = new Map();
for (const name of await readdir('src/assets/images')) {
  const original = path.join('src/assets/images', name);
  const metadata = await sharp(original).metadata();
  if (name === 'og.png') { await sharp(original).png({ compressionLevel: 9 }).toFile(path.join(directory, name)); continue; }
  const outputName = name.replace(/\.(png|webp|svg)$/, '.webp');
  const widths = [...new Set([480, 768, 960, 1200, ...(name === "home-temple-photograph.webp" ? [1600, 2000] : []), Math.min(metadata.width, name === "home-temple-photograph.webp" ? 2400 : 1600)].filter(width => width <= metadata.width))].sort((a,b) => a-b);
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
const storyCatalog = JSON.parse(await readFile('src/data/stories.json','utf8'));
const readingCatalog = { stories:[], pages:{} };
const pages = (await readdir('dist')).filter(name => name.endsWith('.html')).sort();
for (const name of pages) {
  const $ = load(await readFile(`dist/${name}`, 'utf8'));
  const source=await readFile(`src/${name.replace(/\.html$/,'.njk')}`,'utf8');
  const metadata=JSON.parse(source.match(/^---\s*\n([\s\S]*?)\n---/)[1]);
  const hero=metadata.story?$('.tale-hero img').first().attr('src'):null;
  const original=hero?`src${hero}`:`src/assets/images/${metadata.ogImage}`;
  const socialFile=`dist/assets/social/${name.replace(/\.html$/,'.jpg')}`;
  await mkdir('dist/assets/social',{recursive:true});
  await sharp(original).rotate().resize(1200,630,{fit:'contain',background:site.themeColors.light}).flatten({background:site.themeColors.light}).jpeg({quality:78,mozjpeg:true}).toFile(socialFile);
  const pathName = `/${name}`;
  const storyInfo = Object.values(storyCatalog).find(item => item.href === pathName);
  const pageTitle = storyInfo?.title || $('title').text().split('·')[0].trim();
  $('head').append($('<meta>').attr({ 'data-pagefind-meta':'title[content]', content:pageTitle }));

  // Match breadcrumb schema only to navigation actually rendered for readers.
  const trail = $('nav.breadcrumb').first();
  if (trail.length) {
    const items = trail.children('a, span').toArray().map(el => {
      const label = $(el).text().trim();
      if (!label || label === '/') return null;
      const href = $(el).attr('href');
      const url = new URL(href || (label === 'Home' ? '/' : pathName), origin + '/');
      if (url.pathname === '/index.html') url.pathname = '/';
      url.hash = '';
      return { '@type': 'ListItem', position: 0, name: label, item: url.href };
    }).filter(Boolean).map((item, index) => ({ ...item, position: index + 1 }));
    if (items.length >= 2) {
      const jsonLd = $('script[type="application/ld+json"]').first();
      const schema = JSON.parse(jsonLd.text());
      schema['@graph'].push({
        '@type': 'BreadcrumbList',
        '@id': new URL(page('link[rel="canonical"]').attr('href') || (name === 'index.html' ? '/' : '/' + name.replace(/\.html$/, '')), origin).href + '#breadcrumbs',
        itemListElement: items
      });
      jsonLd.text(JSON.stringify(schema).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026'));
    }
  }

  const minutes = storyInfo?.minutes || Math.max(1,Math.ceil($('main').text().trim().split(/\s+/).length/200));
  readingCatalog.pages[pathName] = { title:pageTitle, minutes };
  if (storyInfo) readingCatalog.stories.push({ ...storyInfo, chapters:$('.tale-chapter[id]').toArray().map(el=>({id:$(el).attr('id'),title:$(el).find('h2').first().text()})) });
  $('.site-nav a').each((_, el) => {
    const href = $(el).attr('href');
    if (href === `/${name}`) $(el).attr('aria-current', 'page');
    else if (href === '/stories.html' && $('script[src="/assets/js/reader.js"]').length) $(el).attr('aria-current', 'true');
    else if (href === '/deities.html' && name === 'lalita.html') $(el).attr('aria-current', 'true');
  });
  $('.footer-directory a').each((_, el) => { if ($(el).attr('href') === `/${name}`) $(el).attr('aria-current', 'page'); });
  $('img').each((_, el) => {
    const image = $(el); const variants = images.get(image.attr('src'));
    if (!variants) return;
    const largest = variants.at(-1);
    image.attr({ src: largest.path, width: String(largest.width), height: String(largest.height), decoding: 'async' });
    const isHero = image.closest('.exhibit-visual,.museum-object,.hero,.tale-hero,.collection-hero,.scripture-hero,.lalita-hero,.learn-hero').length;
    image.attr('loading', isHero ? 'eager' : 'lazy');
    image.attr('fetchpriority', isHero ? 'high' : 'low');
    image.attr('srcset', variants.map(variant => `${variant.path} ${variant.width}w`).join(', '));
    const isReader = image.closest('.tale-inline').length;
    const isLeadCard = image.closest('.collection-card').is(':first-child');
    const sizes = image.closest('.exhibit-visual,.museum-object').length ? '(max-width: 700px) 100vw, 80vw' : image.closest('.museum-doorway').length ? '(max-width: 700px) 90vw, 30vw' : image.closest('.home-panorama').length ? '(max-width: 1320px) 94vw, 1216px' : image.closest('.gallery-photograph').length ? '(max-width: 900px) 92vw, (max-width: 1440px) 57vw, 800px' : isReader ? '(max-width: 760px) 92vw, (max-width: 1100px) calc(92vw - 13rem), 65ch'
      : image.closest('.museum-chapter').length ? '(max-width: 760px) calc(100vw - 2.5rem), (max-width: 1440px) 43vw, 620px'
      : isLeadCard ? '(max-width: 760px) 92vw, (max-width: 1312px) calc(51vw - 2rem), 630px'
      : image.closest('.deity-card,.collection-card,.scripture-card').length ? '(max-width: 760px) 92vw, (max-width: 1312px) calc(46vw - 1.5rem), 570px'
      : image.closest('.family-art').length ? '(max-width: 760px) 92vw, 65ch'
      : '(max-width: 760px) 92vw, (max-width: 1312px) calc(46vw - 2rem), 550px';
    image.attr('sizes', sizes);
  });
  if (!['glossary.html','sources.html','search.html','404.html'].includes(name)) {
    const used = new Set($('.glossary-link').toArray().map(el => $(el).attr('href')?.split('#')[1]));
    $('main p:not(.eyebrow):not(.collection-source)').filter((_,el)=>!$(el).closest('a').length).each((_, el) => {
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
  // Display the artwork's subject, not production-method or uploader badges.
  // Original creator, permissions and source evidence remain in the private editorial ledger.
  const originBadge = /\b(?:AI[\s-]*generated|owner[\s-]*(?:supplied|contributed|provided))\b/i;
  $('figure figcaption').each((_, element) => {
    const caption = $(element);
    caption.find('span').each((__, child) => {
      if (originBadge.test($(child).text()) && !$(child).find('*').length) $(child).remove();
    });
    caption.contents().each((__, child) => {
      if (child.type !== 'text' || !originBadge.test(child.data)) return;
      child.data = child.data.split(/\s*[·|]\s*/).filter(part => !originBadge.test(part)).join(' · ').trim();
    });
    if (!caption.text().trim()) caption.remove();
  });
  $('.museum-film-footer span').each((_, element) => {
    const label = $(element);
    label.text(label.text().split(/\s*·\s*/).filter(part => !originBadge.test(part)).join(' · ').trim());
    if (!label.text()) label.remove();
  });
  // Preserve descriptive alternative text, but not origin badges appended to it.
  $('img[alt]').each((_, element) => {
    const image = $(element);
    const text = image.attr('alt') || '';
    if (!originBadge.test(text)) return;
    const cleaned = text.split(/\s*[·—–]\s*/).filter(part => !originBadge.test(part)).join(' · ').trim();
    if (cleaned) image.attr('alt', cleaned);
  });
  await writeFile(`dist/${name}`, await minifyHTML($.html(), { collapseWhitespace: true, removeComments: true, keepClosingSlash: false, removeRedundantAttributes: true }));
}
await writeFile('dist/data/reading-catalog.json',JSON.stringify(readingCatalog));
await writeFile('dist/robots.txt',`User-agent: *\n${site.indexable?'Allow: /':'Disallow: /'}\n\nSitemap: ${origin}/sitemap.xml\n`);
for(const size of [192,512])await sharp('src/assets/brand/sanatan-heritage-logo.webp').resize(size,size,{fit:'contain'}).png().toFile(`dist/assets/brand/icon-${size}.png`);
await writeFile('dist/site.webmanifest',JSON.stringify({id:'/',name:'Sanatan Heritage',short_name:'Sanatan Heritage',description:'Stories, wisdom and traditions of Sanatan Dharma.',lang:'en',start_url:'/',scope:'/',display:'minimal-ui',background_color:site.themeColors.light,theme_color:site.themeColors.light,icons:[192,512].map(size=>({src:`/assets/brand/icon-${size}.png`,sizes:`${size}x${size}`,type:'image/png',purpose:'any'}))}));
const security=JSON.parse(await readFile('src/data/responseHeaders.json','utf8'));
await writeFile('dist/_headers','/*\n'+security.map(({key,value})=>`  ${key}: ${value}`).join('\n')+'\n');
const revision=process.env.CF_PAGES_COMMIT_SHA||process.env.GITHUB_SHA||spawnSync('git',['rev-parse','HEAD'],{encoding:'utf8',windowsHide:true}).stdout.trim();
await writeFile('dist/release.json',JSON.stringify({revision,origin}));
const css = new CleanCSS({ level: 1 }).minify((await readFile('src/assets/css/style.css','utf8')) + '\n' + (await readFile('src/assets/css/refinements.css','utf8')) + '\n' + (await readFile('src/assets/css/art-direction.css','utf8')) + '\n' + (await readFile('src/assets/css/features.css','utf8')));
if (css.errors.length) throw new Error(css.errors.join('\n'));
await writeFile('dist/assets/css/style.css', css.styles);
await rm('dist/assets/css/refinements.css', { force: true });
await rm('dist/assets/css/art-direction.css', { force: true });
await rm('dist/assets/css/features.css', { force: true });
const museumCSS = new CleanCSS({ level:1 }).minify(await readFile('src/assets/css/home-museum.css','utf8'));
if (museumCSS.errors.length) throw new Error(museumCSS.errors.join('\n'));
await writeFile('dist/assets/css/home-museum.css',museumCSS.styles);
for (const name of await readdir('src/assets/js')) {
  const result = await minifyJS(await readFile(`src/assets/js/${name}`, 'utf8'));
  await writeFile(`dist/assets/js/${name}`, result.code);
}
// Publish only indexable canonical URLs and real images embedded on each page.
// The CI checkout cannot establish meaningful last-modified dates; do not invent them.
const escapeXml = value => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const sitemapEntries = [];
for (const filename of pages) {
  if (['404.html','search.html','museum-preview.html'].includes(filename)) continue;
  const page = load(await readFile('dist/' + filename, 'utf8'));
  if (page('meta[name="robots"][content*="noindex"]').length) continue;
  const canonical = page('link[rel="canonical"]').attr('href');
  if (!canonical || !canonical.startsWith(origin + '/') || (canonical !== origin + '/' && canonical.endsWith('.html'))) throw new Error('Invalid sitemap canonical: ' + filename);
  const images = [...new Set(page('main img[src^="/assets/images/"]').toArray()
    .map(el => page(el).attr('src')).filter(Boolean))];
  const imageEntries = images.map(src => '<image:image><image:loc>' + escapeXml(new URL(src, origin).href) + '</image:loc></image:image>').join('');
  sitemapEntries.push('<url><loc>' + escapeXml(canonical) + '</loc>' + imageEntries + '</url>');
}
await writeFile('dist/sitemap.xml', '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">' +
  sitemapEntries.join('') + '</urlset>\n');
run(['node_modules/pagefind/lib/runner/bin.cjs', '--site', 'dist']);
console.log(`Built ${pages.length} pages, responsive WebP images, minified assets and search index.`);
