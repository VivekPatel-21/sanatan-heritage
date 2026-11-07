import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {JSDOM} from 'jsdom';
const terms=JSON.parse(await readFile('src/data/glossary.json','utf8'));
const categories=new Set(['ideas','practice','divine','texts','cosmos']);
assert.ok(terms.length>=40);
assert.equal(new Set(terms.map(t=>t.id)).size,terms.length);
assert.ok(terms.every(t=>categories.has(t.category)));
const dom=new JSDOM(await readFile('dist/glossary.html','utf8'),{url:'https://sanatan.test/glossary.html',runScripts:'outside-only'});
const doc=dom.window.document;
dom.window.eval(await readFile('src/assets/js/directory.js','utf8'));
const select=doc.querySelector('#directory-category');
assert.ok(select);
select.value='cosmos';select.dispatchEvent(new dom.window.Event('change',{bubbles:true}));
assert.equal(doc.querySelectorAll('[data-directory-item]:not([hidden])').length,terms.filter(t=>t.category==='cosmos').length);
assert.equal(new URLSearchParams(dom.window.location.search).get('group'),'cosmos');
doc.querySelector('[data-directory-form]').reset();
assert.equal(doc.querySelectorAll('[data-directory-item]:not([hidden])').length,terms.length);
dom.window.close();
const page=new JSDOM(await readFile('dist/reading-paths.html','utf8')).window.document;
assert.equal(page.querySelectorAll('.reader-panel[id^="path-"]').length,8);
for(let i=1;i<=8;i++)assert.ok(page.querySelector('#path-'+i+' .reading-steps a'));
const sources=await readFile('dist/sources.html','utf8');
for(const id of ['avatars','mahapuranas','philosophy'])assert.ok(sources.includes('id="'+id+'"'));
for(const p of ['scriptures','deities','avatars','great-rishis','philosophy','fourteen-lokas','manus-manvantaras','mahapuranas']){
const html=await readFile('dist/'+p+'.html','utf8');assert.ok(html.includes('learning-connections'),p);
}
console.log('Learning expansion tests passed.');
