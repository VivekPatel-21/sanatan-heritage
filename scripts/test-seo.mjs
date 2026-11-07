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
assert.equal(pageUrls.size,urls.filter(link=>link.endsWith('.html')||link===site.origin+'/').length,'Unexpected sitemap page count');
assert.ok(imageUrls.size>=100,'Image sitemap unexpectedly small');
for(const url of imageUrls)assert.ok(imageSitemapUrls.includes(url),'Image omitted from sitemap: '+url);
const head=load(await readFile('dist/index.html','utf8'));
assert.ok(head('script[src="/assets/js/google-analytics.js"][defer]').length,'Analytics bootstrap must be deferred');
assert.ok(head('link[rel="preload"][as="image"][type="image/webp"]').length,'Homepage poster preload missing');
console.log('Passed: canonical image sitemap, accurate breadcrumb schema and nonblocking analytics bootstrap.');
