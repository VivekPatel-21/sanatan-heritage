import {readFile,readdir,stat} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {load} from 'cheerio';
import sharp from 'sharp';
import {site} from './site-config.mjs';
const pages=(await readdir('dist')).filter(name=>name.endsWith('.html'));
let maxPreview=0;
for(const name of pages){
  const source=await readFile(`src/${name.replace(/\.html$/,'.njk')}`,'utf8');
  assert.ok(!source.match(/"canonical"\s*:/),`${name} must not duplicate canonical origins in front matter`);
  const $=load(await readFile(`dist/${name}`,'utf8'));
  const canonical=site.origin+(name==='index.html'?'/':'/'+name);
  assert.equal($('link[rel=canonical]').attr('href'),canonical);
  assert.equal($('meta[property="og:url"]').attr('content'),canonical);
  const social=$('meta[property="og:image"]').attr('content');assert.ok(social.startsWith(site.origin+'/assets/social/'));
  assert.equal($('meta[name="twitter:image"]').attr('content'),social);
  const file='dist'+new URL(social).pathname,info=await sharp(file).metadata(),size=(await stat(file)).size;
  assert.equal(info.format,'jpeg');assert.equal(info.width,1200);assert.equal(info.height,630);assert.ok(size<300000);maxPreview=Math.max(maxPreview,size);
  const graph=JSON.parse($('script[type="application/ld+json"]').text());assert.equal(graph['@context'],'https://schema.org');
  assert.equal(graph['@graph'].find(item=>item['@type']==='WebSite').url,site.origin+'/');
  const content=graph['@graph'].find(item=>item['@type']==='Article'||item['@type']==='WebPage');assert.equal(content.url,canonical);
  assert.equal($('meta[name="theme-color"]').attr('content'),site.themeColors.light);
  assert.equal($('link[rel="manifest"]').attr('href'),'/site.webmanifest');
  assert.equal($('[onsubmit],[onclick],[onerror],[onload]').length,0,'CSP must not rely on inline handlers');
}
const manifest=JSON.parse(await readFile('dist/site.webmanifest','utf8'));for(const icon of manifest.icons)assert.ok((await stat('dist'+icon.src)).size>0);
const robots=await readFile('dist/robots.txt','utf8');assert.ok(robots.includes(site.origin+'/sitemap.xml'));assert.ok(robots.includes(site.indexable?'Allow: /':'Disallow: /'));
assert.ok((await readFile('dist/_headers','utf8')).includes('X-Content-Type-Options: nosniff'));
console.log(`Passed: ${pages.length} centralized canonical/social/schema pages, 1200×630 JPEG previews (maximum ${maxPreview} bytes), manifest, theme metadata, robots and headers.`);
