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

const captionsRe=/\b(?:AI[\s-]*generated|owner[\s-]*(?:supplied|contributed|provided))\b/i;
const pages=(await (await import('node:fs/promises')).readdir('dist')).filter(name=>name.endsWith('.html'));
for(const page of pages){
  const html=await readFile('dist/'+page,'utf8');
  const document=new JSDOM(html).window.document;
  for(const caption of document.querySelectorAll('figure figcaption, .museum-film-footer span')){
    assert.ok(!captionsRe.test(caption.textContent),page+': public artwork origin badge remains');
    assert.ok(caption.textContent.trim(),page+': blank artwork caption');
  }
}
const sourceDoc=new JSDOM(await readFile('dist/sources.html','utf8')).window.document;
for(const id of ['avatars','mahapuranas','philosophy'])
  assert.equal(sourceDoc.querySelectorAll('[id="'+id+'"]').length,1,'Duplicate source anchor: '+id);


const familyDoc=new JSDOM(await readFile('dist/family.html','utf8')).window.document;
for(const id of ['shiva','hanuman','dhruva','rama','krishna','devi']){
 const section=familyDoc.querySelector('#family-'+id);
 assert.ok(section,'Missing family companion: '+id);
 assert.ok(section.querySelectorAll('.family-questions li').length>=3,'Missing discussion questions: '+id);
 assert.ok(section.querySelector('.collection-source a'),'Missing primary text note: '+id);
}
const allTerms=JSON.parse(await readFile('src/data/glossary.json','utf8'));
assert.ok(allTerms.every(t=>typeof t.source==='string'&&t.source.length>0),'All glossary terms should link to source context');
assert.ok((await readFile('dist/sources.html','utf8')).includes('id="glossary-foundations"'));

console.log('Learning expansion tests passed, including artwork captions, family readers and source notes.');
