import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import {load} from 'cheerio';
const catalog=JSON.parse(await readFile('src/data/stories.json','utf8'));
assert.equal(catalog.nala.href,'/nala-damayanti.html');
assert.deepEqual(catalog.nala.collections,['mahabharata']);
const $=load(await readFile('dist/nala-damayanti.html','utf8'));
assert.equal($('.tale-chapter').length,13,'Complete adaptation must have thirteen chapters');
assert.equal($('.tale-hero-art img').length,1);
assert.equal($('.tale-inline img').length,1);
assert.equal($('.tale-hero-art img, .tale-inline img').length,2,'Exactly two story images');
assert.equal($('.tale-contents nav a[href^="#"]').length,15,'13 chapters + reflection and interpretation');
assert.ok($('a[href="/sources.html#nala-damayanti"]').length>=2);
assert.ok($('a[href="/savitri-satyavan.html"]').length>=1);
assert.ok($('a[href="/stories.html?collection=mahabharata#library"]').length>=1);
const collection=load(await readFile('dist/stories.html','utf8'));
const card=collection('#story-nala-damayanti');
assert.equal(card.length,1);
assert.equal(card.find('img').length,1);
assert.ok(card.attr('data-collections').includes('mahabharata'));
assert.equal(new Set([card.find('img').attr('src'),$('.tale-hero-art img').attr('src'),$('.tale-inline img').attr('src')]).size,3,'Distinct art per placement');
const sources=load(await readFile('dist/sources.html','utf8'));
assert.equal(sources('#nala-damayanti').length,1);
assert.equal(sources('#nala-damayanti .reference-list>li').length,13);
for(const name of ['nala-damayanti-reunion.webp','nala-damayanti-swan.webp','nala-damayanti-swayamvara.webp'])
  await access('dist/assets/images/'+name);
const source=await readFile('src/nala-damayanti.njk','utf8');
const cards=await readFile('src/stories.njk','utf8');
assert.ok(!source.includes('nala-damayanti-forest.svg'),'Retired vector illustration remains in reader');
assert.ok(!cards.includes('nala-damayanti-reunion.svg'),'Retired vector illustration remains on card');
for(const name of ['nala-damayanti-swan.png','nala-damayanti-swayamvara.png','nala-damayanti-reunion.png']){
 const bytes=await readFile('src/assets/images/'+name);
 assert.equal(bytes.subarray(0,8).toString('hex'),'89504e470d0a1a0a','Invalid PNG source: '+name);
}
assert.equal($('.tale-hero-art img[src*="nala-damayanti-swayamvara"]').length,1);
assert.equal($('.tale-inline img[src*="nala-damayanti-reunion"]').length,1);
assert.equal(card.find('img[src*="nala-damayanti-swan"]').length,1);
console.log('Passed: Nala reader and three separate cinematic PNG placements.');
