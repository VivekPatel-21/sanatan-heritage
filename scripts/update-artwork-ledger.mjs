import { readFile, writeFile, readdir } from 'node:fs/promises';
import { load } from 'cheerio';
const file = 'ARTWORK_LEDGER.json';
let previous = [];
try { previous = JSON.parse(await readFile(file, 'utf8')); } catch { /* First ledger. */ }
const saved = new Map(previous.map(item => [item.asset, item]));
const newAssets = new Set(['hanuman-lanka-reader.webp', 'hanuman-ashoka.webp', 'family-hanuman.webp', 'krishna-govardhana-reader.webp', 'krishna-indra-humility.webp', 'rama-exile-reader.webp', 'rama-chitrakuta.webp', 'devi-mahishasura-reader.webp', 'mahishasura-buffalo.webp', 'bhagiratha-ganga-reader.webp', 'bhagiratha-ganga-journey.webp']);
const recovered = { 'home-temple-photograph.webp': 'IMG_9684.JPG', 'temple-photograph.webp': 'IMG_4273.JPG', 'temple-shikhara.webp': 'IMG_3634.JPG', 'lalita-lotus-contributed.webp': 'IMG_3594.JPG', 'lalita-kameshvara-contributed.webp': 'IMG_3632.JPG', 'lalita-radiance.webp': 'IMG_3568.JPG', 'lalita-assembly.webp': 'IMG_3636.JPG' };
const records = [];
for (const page of (await readdir('src')).filter(name => name.endsWith('.njk'))) {
  const $ = load((await readFile(`src/${page}`, 'utf8')).replace(/^---[\s\S]*?---/, ''));
  $('img').each((_, el) => {
    const image = $(el); const asset = image.attr('src').split('/').at(-1);
    const caption = image.closest('figure').find('figcaption').text().trim();
    const generated = newAssets.has(asset);
    records.push({ ...saved.get(asset), asset, visiblePlacement: page, alt: image.attr('alt'), caption,
      origin: recovered[asset] ? `Owner contribution: ${recovered[asset]}` : generated ? 'Built-in Imagegen; see IMAGE_PROMPTS.json' : saved.get(asset)?.origin || (/AI-GENERATED/i.test(caption) ? 'Earlier AI-generated illustration; original mapping in reference-assets where available' : 'Earlier devotional artwork; creator/origin verification pending'),
      creator: asset === 'home-temple-photograph.webp' ? 'Owner-contributed photograph; photographer not independently established' : generated ? 'AI-generated interpretation' : saved.get(asset)?.creator || 'Not independently established',
      permission: asset === 'home-temple-photograph.webp' ? 'Owner explicitly authorized homepage use in this session; no public redistribution review claimed' : generated ? 'Created for the owner-authorized implementation' : saved.get(asset)?.permission || 'Existing approved placement; public redistribution rights not independently established',
      review: asset === 'home-temple-photograph.webp' ? 'Photograph visually checked for responsive crop; location remains unidentified' : asset === 'devi-mahishasura-reader.webp' ? 'Assistant visual review: eight distinct arms, selected attributes and lion checked; devotional convention, no specialist review claimed' : asset === 'mahishasura-buffalo.webp' ? 'Assistant visual review: buffalo anatomy, two horns and one tail checked; symbolic scene, no specialist review claimed' : asset === 'bhagiratha-ganga-journey.webp' ? 'Assistant visual review: one human with two arms, chariot wheels and single horse anatomy checked; imagined design, no specialist review claimed' : generated ? 'Assistant visual review: two arms/two legs, subject and scene checked; no specialist review claimed' : saved.get(asset)?.review || 'Existing approved placement; independent iconography review pending',
      identity: (asset === 'home-temple-photograph.webp' || /^temple-/.test(asset)) ? 'Unidentified; owner requested no temple attribution' : image.attr('alt') });
  });
}
await writeFile(file, JSON.stringify(records, null, 2) + '\n');
console.log(`Recorded ${records.length} unique placements in the offline artwork ledger.`);
