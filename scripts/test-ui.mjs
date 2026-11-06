import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
const terms = JSON.parse(await readFile('src/data/glossary.json', 'utf8'));
const journeyData = JSON.parse(await readFile('src/data/journeys.json', 'utf8'));
const storyData = JSON.parse(await readFile('src/data/stories.json', 'utf8'));
const scriptureCollections = JSON.parse(await readFile('src/data/scriptureCollections.json', 'utf8'));
const collectionRecords = scriptureCollections.categories.flatMap(category => category.collections);
const collectionIds = new Set(collectionRecords.map(collection => collection.id));
assert.equal(collectionIds.size, collectionRecords.length);
assert.ok(Object.values(storyData).every(story => story.collections.length && story.collections.every(id => collectionIds.has(id))));
assert.ok(collectionRecords.filter(collection => collection.enabled).every(collection => Object.values(storyData).some(story => story.collections.includes(collection.id))));
assert.ok(collectionRecords.filter(collection => !collection.enabled).every(collection => !Object.values(storyData).some(story => story.collections.includes(collection.id))));
assert.deepEqual(storyData.nachiketa.collections, ['krishna-yajurveda-literature', 'upanishads']);
assert.deepEqual(storyData.yaksha.collections, ['samaveda-literature', 'upanishads']);
assert.ok(['mahamaya','mahishasura','shumbha'].every(key => storyData[key].collections.includes('devi-mahatmya') && storyData[key].collections.includes('markandeya-purana')));
async function page(name) {
  const dom = new JSDOM(await readFile(`dist/${name}.html`, 'utf8'), { url: `https://sanatan-heritage.test/${name}.html`, runScripts: 'outside-only', pretendToBeVisual: true });
  dom.window.fetch = async () => ({ ok: true, json: async () => terms });
  for (const script of ['theme','reading-state','site',...(['glossary','deities'].includes(name) ? ['directory'] : []), ...(name === 'stories' ? ['stories'] : []), ...(name === 'explore' ? ['explorer'] : []), ...(['lalita-bhandasura','shiva-parvati','daksha-yajna-sati','shiva-halahala','shiva-andhakasura','hanuman-lanka','krishna-govardhana','krishna-kaliya','krishna-sudama','ajamila','mahamaya-madhu-kaitabha','rama-exile','jatayu-sacrifice','devi-mahishasura','devi-shumbha-nishumbha','bhagiratha-ganga','ganesha-birth','kartikeya-birth','gajendra-moksha','varaha-earth','prahlada-narasimha','vamana-king-bali','markandeya-shiva','tripura-destruction','prithu-earth'].includes(name) ? ['reader'] : [])]) dom.window.eval(await readFile(`src/assets/js/${script}.js`, 'utf8'));
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
 doc.querySelector('[data-directory-form]').reset(); assert.equal(doc.querySelectorAll('[data-directory-item]:not([hidden])').length,name==='glossary'?terms.length:12);
 if(name==='deities'){const select=doc.querySelector('select');select.value='goddess';select.dispatchEvent(new dom.window.Event('input',{bubbles:true}));assert.equal(doc.querySelectorAll('[data-directory-item]:not([hidden])').length,5);}
 dom.window.close();
}

// Scripture collections must filter one canonical set of story cards and preserve return context.
const collection = await page('stories');
const collectionDoc = collection.window.document;
const storyCards = [...collectionDoc.querySelectorAll('.collection-card')];
assert.equal(collectionDoc.querySelector('#story-count').textContent.trim(), `${storyCards.length} full stories`);
assert.equal(collectionDoc.querySelectorAll('[data-collection-link]').length, 15);
assert.equal(collectionDoc.querySelectorAll('[data-collection-link="atharvaveda-literature"]').length, 0);
assert.equal(collectionDoc.querySelectorAll('[data-collection-link="mahabharata"]').length, 0);
const collectionFilter = collectionDoc.querySelector('#collection-filter');
collectionFilter.value = 'rigveda-samhita'; collectionFilter.dispatchEvent(new collection.window.Event('change'));
assert.equal(collectionDoc.querySelectorAll('.collection-card:not([hidden])').length, 1);
assert.equal(collectionDoc.querySelector('.collection-card:not([hidden]) .tale-card-link').getAttribute('href'), '/indra-vritra.html?collection=rigveda-samhita');
assert.ok(collectionDoc.querySelector('[data-collection-context="rigveda-samhita"]').textContent.includes('Samhita'));
collectionFilter.value = 'devi-mahatmya'; collectionFilter.dispatchEvent(new collection.window.Event('change'));
assert.equal(collectionDoc.querySelectorAll('.collection-card:not([hidden])').length, 3);
assert.ok([...collectionDoc.querySelectorAll('.collection-card:not([hidden]) .collection-source')].every(source => source.textContent.includes('Markandeya Purana')));
collectionDoc.querySelector('#story-search').value = 'not-a-real-story';
collectionDoc.querySelector('#story-search').dispatchEvent(new collection.window.Event('input'));
assert.equal(collectionDoc.querySelector('#no-stories').hidden, false);
collectionDoc.querySelector('#empty-reset').click();
assert.equal(collectionDoc.querySelectorAll('.collection-card:not([hidden])').length, storyCards.length);
assert.equal(collectionDoc.activeElement, collectionDoc.querySelector('#story-search'));
collection.window.close();

const directory = await page('deities');
const directoryDoc = directory.window.document;
directoryDoc.querySelector('#directory-query').value = 'Krishna';
directoryDoc.querySelector('#directory-query').dispatchEvent(new directory.window.Event('input', { bubbles: true }));
assert.equal(directoryDoc.querySelector('.deity-index a[href="#shiva"]').hidden, true);
assert.equal(directoryDoc.querySelector('.deity-index a[href="#krishna"]').hidden, false);
directory.window.close();

const explorer = await page('explore');
const choice = explorer.window.document.querySelector('#journey-choice');
choice.value = 'hanuman'; choice.dispatchEvent(new explorer.window.Event('change'));
assert.equal(explorer.window.document.querySelectorAll('[data-journey]:not([hidden])').length, 1);
choice.value = 'all'; choice.dispatchEvent(new explorer.window.Event('change'));
assert.equal(explorer.window.document.querySelectorAll('[data-journey]:not([hidden])').length, journeyData.length);
explorer.window.close();

const festivals = await page('festivals');
const festivalDoc = festivals.window.document;
assert.equal(festivalDoc.querySelectorAll('.festival-story-links').length, 9);
assert.equal(festivalDoc.querySelector('#calendar-bali-pratipada .festival-story-links a').getAttribute('href'), '/vamana-king-bali.html');
assert.equal(festivalDoc.querySelectorAll('#calendar-navaratri .festival-story-links a').length, 3);
assert.ok([...festivalDoc.querySelectorAll('.festival-story-links a')].every(link => link.textContent.trim().length > 0));
festivals.window.close();

const readerDoc = story.window.document;
const readerSize = readerDoc.querySelector('#reader-size');
readerSize.value = 'large'; readerSize.dispatchEvent(new story.window.Event('change'));
assert.equal(readerDoc.querySelector('.tale-body').dataset.textSize, 'large');
assert.equal(story.window.localStorage.getItem('sanatan-reader-size'), 'large');
readerDoc.querySelector('#save-chapter').click();
assert.equal(readerDoc.querySelector('#save-chapter').getAttribute('aria-pressed'), 'true');
assert.equal(readerDoc.querySelector('#save-chapter').textContent, 'Chapter bookmarked');
assert.equal(readerDoc.querySelector('#resume-reading').hidden, false);
assert.ok(story.window.localStorage.getItem('sanatan-bookmark:/lalita-bhandasura.html'));
readerDoc.querySelector('#clear-bookmark').click();
assert.equal(readerDoc.querySelector('#save-chapter').getAttribute('aria-pressed'), 'false');
assert.equal(readerDoc.querySelector('#save-chapter').textContent, 'Bookmark this chapter');
assert.equal(readerDoc.querySelector('#resume-reading').hidden, true);
assert.equal(story.window.localStorage.getItem('sanatan-bookmark:/lalita-bhandasura.html'), null);

const searchDom = new JSDOM(await readFile('dist/search.html', 'utf8'), { url: 'https://sanatan-heritage.test/search.html?q=bhakti', runScripts: 'outside-only' });
let searchQuery;
searchDom.window.PagefindUI = class { triggerSearch(query) { searchQuery = query; } };
searchDom.window.eval(await readFile('src/assets/js/search.js', 'utf8'));
searchDom.window.document.dispatchEvent(new searchDom.window.Event('DOMContentLoaded'));
assert.equal(searchQuery, 'bhakti');
assert.equal(searchDom.window.document.querySelector('#search-help').hidden, true);
searchDom.window.close();

const glossaryAudio = await page('glossary');
glossaryAudio.window.eval(await readFile('src/assets/js/pronunciation.js', 'utf8'));
assert.ok(glossaryAudio.window.document.querySelector('#pronunciation-status').textContent.includes('unavailable'));
assert.ok([...glossaryAudio.window.document.querySelectorAll('[data-pronounce]')].every(button => button.hidden));
glossaryAudio.window.SpeechSynthesisUtterance = class { constructor(text) { this.text = text; } };
let spoken;
glossaryAudio.window.speechSynthesis = { getVoices: () => [{ lang: 'hi-IN' }], cancel() {}, speak(utterance) { spoken = utterance; } };
glossaryAudio.window.eval(await readFile('src/assets/js/pronunciation.js', 'utf8'));
const listen = glossaryAudio.window.document.querySelector('[data-pronounce]');
listen.click();
assert.equal(spoken.text, listen.dataset.pronounce);
assert.equal(spoken.lang, 'hi-IN');
assert.equal(listen.getAttribute('aria-pressed'), 'true');
spoken.onend(); assert.equal(listen.getAttribute('aria-pressed'), 'false');
glossaryAudio.window.close();
story.window.close();
console.log('Passed: menu keyboard focus, persisted theme, glossary definitions and focus, reading progress, both directories, story filter combinations/reset, explorer, reader preferences/bookmarks, search initialization, and pronunciation fallback/playback.');
