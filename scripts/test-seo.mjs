import assert from 'node:assert/strict';
import {readFile, readdir} from 'node:fs/promises';
import {load} from 'cheerio';
import {site} from './site-config.mjs';

const pages=(await readdir('dist')).filter(name=>name.endsWith('.html'));
const xml=await readFile('dist/sitemap.xml','utf8');
assert.match(xml,/xmlns:image="http:\/\/www\.google\.com\/schemas\/sitemap-image\/1\.1"/);
const urls=[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match=>match[1].replace(/&amp;/g,'&'));
const imageSitemapUrls=[...xml.matchAll(/<image:loc>([^<]+)<\/image:loc>/g)].map(match=>match[1].replace(/&amp;/g,'&'));
const pageUrls=new Set(), imageUrls=new Set();
for(const name of pages){
  const html=await readFile('dist/'+name,'utf8');
  const $=load(html);
  const canonical=$('link[rel="canonical"]').attr('href');
  assert.ok(canonical.startsWith(site.origin+'/'),name+': canonical is not absolute');
  if(['404.html','search.html','museum-preview.html'].includes(name)) {
    assert.ok(!urls.includes(canonical),name+': nonindexable page in sitemap');
    continue;
  }
  pageUrls.add(canonical);
  assert.ok(urls.includes(canonical),name+': missing canonical sitemap URL');
  const breadcrumbs=$('nav.breadcrumb').first();
  if(breadcrumbs.length){
    const items=breadcrumbs.children('a,span').toArray().map(el=>$(el).text().trim()).filter(label=>label && label!=='/');
    const graph=JSON.parse($('script[type="application/ld+json"]').first().text())['@graph'];
    if(items.length>=2){
      const list=graph.find(node=>node['@type']==='BreadcrumbList');
      assert.ok(list,name+': no structured breadcrumb trail');
      assert.deepEqual(list.itemListElement.map(el=>el.name),items,name+': breadcrumb text differs from navigation');
      assert.ok(list.itemListElement.every((el,i)=>el.position===i+1 && el.item.startsWith(site.origin+'/')));
    }
  }
  for(const el of $('main img[src^="/assets/images/"]').toArray())imageUrls.add(new URL($(el).attr('src'),site.origin).href);
}
assert.equal(pageUrls.size,urls.length,'Unexpected sitemap page count');
assert.ok(urls.every(url=>url===site.origin+'/' || !url.endsWith('.html')),'Sitemap must contain final clean URLs, not .html redirects');
assert.equal(new Set(urls).size,urls.length,'Duplicate canonical URL in sitemap');
assert.ok(imageUrls.size>=100,'Image sitemap unexpectedly small');
for(const url of imageUrls)assert.ok(imageSitemapUrls.includes(url),'Image omitted from sitemap: '+url);
// The featured story readers must answer their main search intent and preserve their exact source references.
for (const [name,phrase,source] of [
  ['gajendra-moksha.html','What is Gajendra Moksha?','Skandha 8, chapters 2–4'],
  ['jatayu-sacrifice.html','Who was Jatayu, and why did he fight Ravana?','Aranya Kanda'],
  ['kartikeya-birth.html','How was Kartikeya born?','Kumara Khanda, chapters 1–5']
]) {
  const story=load(await readFile('dist/'+name,'utf8'));
  assert.equal(story('main h1').length,1,name+': expected one story H1');
  assert.ok(story('main h1').text().match(/Gajendra|Jatayu|Kartikeya/),name+': story name missing from heading');
  assert.ok(story('.tale-introduction').text().includes(phrase),name+': introduction must answer its key question');
  assert.ok(story('.tale-introduction').text().includes(source),name+': introduction missing scripture location');
  assert.ok(story('.tale-introduction a[href^="/sources.html#"]').length,name+': missing source link');
}
const head=load(await readFile('dist/index.html','utf8'));
assert.ok(head('script[src="/assets/js/google-analytics.js"][defer]').length,'Analytics bootstrap must be deferred');
assert.ok(head('link[rel="preload"][as="image"][type="image/webp"]').length,'Homepage poster preload missing');
console.log('Passed: canonical image sitemap, accurate breadcrumb schema and nonblocking analytics bootstrap.');
