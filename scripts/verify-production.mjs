import assert from 'node:assert/strict';
import {site} from './site-config.mjs';
const expected=process.env.EXPECTED_REVISION;
if(!expected)throw new Error('Set EXPECTED_REVISION to the GitHub commit being deployed.');
const probe=path=>{const url=new URL(path,site.origin);url.searchParams.set('__release',expected);return url;};
let release;
for(let attempt=0;attempt<40;attempt++){
  try{const response=await fetch(probe('/release.json'),{cache:'no-store',signal:AbortSignal.timeout(15000)});if(response.ok){release=await response.json();if(release.revision===expected)break;}}catch{/* The Cloudflare deployment may still be building or propagating. */}
  if(attempt===39)throw new Error('Cloudflare has not served the expected commit. Check the Cloudflare Pages/Workers production branch, build settings and deployment logs.');
  await new Promise(resolve=>setTimeout(resolve,10000));
}
assert.equal(release.origin,site.origin);
const response=await fetch(probe('/'),{cache:'no-store',signal:AbortSignal.timeout(15000)});assert.equal(response.status,200);
assert.equal(response.headers.get('x-content-type-options'),'nosniff');
assert.equal(response.headers.get('referrer-policy'),'strict-origin-when-cross-origin');
assert.ok(response.headers.get('content-security-policy')?.includes("script-src 'self'"));
const html=await response.text();assert.ok(html.includes(site.origin+'/assets/social/index.jpg'));assert.ok(html.includes('application/ld+json'));
const image=await fetch(probe('/assets/social/index.jpg'),{cache:'no-store'});assert.ok(image.ok);assert.ok(image.headers.get('content-type')?.includes('image/jpeg'));assert.ok((await image.arrayBuffer()).byteLength<300000);
// Verify the actual production sitemap and the three stories improved this week.
const sitemapResponse=await fetch(probe('/sitemap.xml'),{cache:'no-store',signal:AbortSignal.timeout(15000)});
assert.equal(sitemapResponse.status,200,'Production sitemap must return HTTP 200');
const sitemap=await sitemapResponse.text();
assert.ok(sitemap.includes('<urlset'),'Sitemap XML is missing its urlset');
for(const [slug,heading,question] of [
  ['gajendra-moksha','Gajendra Moksha','What is Gajendra Moksha?'],
  ['jatayu-sacrifice','Jatayu','Who was Jatayu, and why did he fight Ravana?'],
  ['kartikeya-birth','Kartikeya','How was Kartikeya born?']
]){
  const cleanUrl=site.origin+'/'+slug;
  assert.ok(sitemap.includes('<loc>'+cleanUrl+'</loc>'),slug+': clean URL missing from production sitemap');
  assert.ok(!sitemap.includes('<loc>'+cleanUrl+'.html</loc>'),slug+': redirecting .html URL remains in production sitemap');
  const storyResponse=await fetch(probe('/'+slug),{cache:'no-store',signal:AbortSignal.timeout(15000)});
  assert.equal(storyResponse.status,200,slug+': clean production URL must return HTTP 200');
  const storyHtml=await storyResponse.text();
  const canonicalTag=storyHtml.match(/<link[^>]*rel=["']canonical["'][^>]*>/i)?.[0] || '';
  assert.ok(canonicalTag.includes(cleanUrl),slug+': canonical URL must be the clean address. Found: '+JSON.stringify(canonicalTag)+'; nearby link tags: '+JSON.stringify(storyHtml.match(/<link[^>]*canonical[^>]*>/ig)?.slice(0,3) || []));
  assert.ok(storyHtml.includes(heading),slug+': expected story heading missing');
  // Glossary links can wrap individual words in the story's visible introduction.
  const visibleStoryText=storyHtml.replace(/<[^>]*>/g,'').replace(/\s+/g,' ').trim();
  assert.ok(visibleStoryText.includes(question),slug+': expected reader introduction missing from visible page text');
  assert.ok(storyHtml.includes('/sources.html#'+slug),slug+': story source citation link missing');
  assert.ok(!/<meta[^>]*name=["']?robots["']?[^>]*noindex/i.test(storyHtml),slug+': page must remain indexable');
  console.log('Verified live SEO reader /'+slug+' (HTTP 200, canonical, intro, citations).');
}
console.log('Verified live clean sitemap, all three story readers, Cloudflare production commit '+expected+', security headers, schema and JPEG preview.');
