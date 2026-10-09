import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
const terms = JSON.parse(await readFile('src/data/glossary.json', 'utf8'));
async function page(name) {
  const dom = new JSDOM(await readFile(`dist/${name}.html`, 'utf8'), { url: `https://sanatan-heritage.test/${name}.html`, runScripts: 'outside-only', pretendToBeVisual: true });
  dom.window.fetch = async () => ({ ok: true, json: async () => terms });
  for (const script of ['theme','site',...(['glossary','deities'].includes(name) ? ['directory'] : [])]) dom.window.eval(await readFile(`src/assets/js/${script}.js`, 'utf8'));
  await new Promise(resolve => setImmediate(resolve));
  return dom;
}
const story = await page('lalita-bhandasura');
let document = story.window.document;
const menu = document.querySelector('.menu-toggle'); menu.click(); assert.equal(menu.getAttribute('aria-expanded'),'true');
document.dispatchEvent(new story.window.KeyboardEvent('keydown',{key:'Escape',bubbles:true})); assert.equal(menu.getAttribute('aria-expanded'),'false'); assert.equal(document.activeElement,menu);
document.querySelector('.theme-toggle').click(); assert.equal(document.documentElement.dataset.theme,'dark'); assert.equal(story.window.localStorage.getItem('sanatan-theme'),'dark');
story.window.eval(await readFile('src/assets/js/theme.js','utf8')); assert.equal(document.documentElement.dataset.theme,'dark');
const term = document.querySelector('.glossary-link'); assert.ok(term); term.click();
const card = document.querySelector('.glossary-popover'); assert.equal(card.hidden,false); assert.ok(card.textContent.includes(terms.find(t=>t.id===term.hash.slice(1)).definition));
document.dispatchEvent(new story.window.KeyboardEvent('keydown',{key:'Escape',bubbles:true})); assert.equal(card.hidden,true); assert.equal(document.activeElement,term);
const article=document.querySelector('.tale-body'); article.getBoundingClientRect=()=>({top:-1000,height:1500}); story.window.dispatchEvent(new story.window.Event('scroll')); await new Promise(resolve=>story.window.requestAnimationFrame(resolve)); assert.equal(document.querySelector('.reading-progress').getAttribute('aria-valuenow'),'100');
for (const name of ['glossary','deities']) {
 const dom=await page(name); const doc=dom.window.document; const input=doc.querySelector('#directory-query');
 input.value=name==='glossary'?'मोक्ष':'गणेश'; input.dispatchEvent(new dom.window.Event('input',{bubbles:true}));
 assert.equal(doc.querySelectorAll('[data-directory-item]:not([hidden])').length,1);
 input.value='unfindableword'; input.dispatchEvent(new dom.window.Event('input',{bubbles:true})); assert.equal(doc.querySelector('#directory-empty').hidden,false);
 doc.querySelector('[data-directory-form]').reset(); assert.equal(doc.querySelectorAll('[data-directory-item]:not([hidden])').length,12);
 if(name==='deities'){const select=doc.querySelector('select');select.value='goddess';select.dispatchEvent(new dom.window.Event('input',{bubbles:true}));assert.equal(doc.querySelectorAll('[data-directory-item]:not([hidden])').length,5);}
 dom.window.close();
}
story.window.close();
console.log('Passed: menu keyboard focus, persisted theme, glossary definitions and focus, reading progress, both directory searches and category filter.');
