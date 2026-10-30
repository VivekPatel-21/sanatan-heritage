import { readdir, mkdir, writeFile, readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
const { chromium } = await import(process.env.SANATAN_PLAYWRIGHT_PATH ? pathToFileURL(process.env.SANATAN_PLAYWRIGHT_PATH).href : 'playwright');
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const context = await browser.newContext();
const page = await context.newPage();
await mkdir('.qa', { recursive: true });
const pages = (await readdir('dist')).filter(file => file.endsWith('.html'));
const results = [];
const important = new Set(['index.html','stories.html','deities.html','hanuman-lanka.html','krishna-govardhana.html','rama-exile.html','devi-mahishasura.html','devi-shumbha-nishumbha.html','bhagiratha-ganga.html','ganesha-birth.html','gajendra-moksha.html','varaha-earth.html','prahlada-narasimha.html','glossary.html','family.html','explore.html']);
const runtimeErrors = [];
page.on('pageerror', error => runtimeErrors.push(String(error)));
for (const width of [375,768,1440]) {
  await page.setViewportSize({ width, height: 900 });
  for (const theme of ['light','dark']) {
    for (const route of pages) {
      await page.goto(`http://127.0.0.1:8080/${route}`, { waitUntil: 'networkidle' });
      if ((await page.locator('html').getAttribute('data-theme'))!==theme) {
        await page.getByRole('button',{name:/Switch to .* theme/}).click();
        await page.waitForFunction(()=>!document.documentElement.classList.contains('theme-changing'));
      }
      await page.evaluate(() => document.fonts.ready);
      await page.evaluate(async () => {
        await Promise.all([...document.images].map(async image => {
          image.loading = 'eager';
          try { await image.decode(); } catch { /* Report broken assets below. */ }
        }));
      });
      const layout = await page.evaluate(() => {
        const clippedCaptions = [...document.querySelectorAll('figure')].filter(figure => {
          const caption = figure.querySelector('figcaption');
          if (!caption) return false;
          const f = figure.getBoundingClientRect(), c = caption.getBoundingClientRect();
          return getComputedStyle(figure).overflow === 'hidden' && c.bottom > f.bottom + 1;
        }).map(figure => figure.querySelector('img')?.getAttribute('src'));
        const badImages = [...document.images].filter(image => !image.complete || !image.naturalWidth).map(image => image.src);
        return { overflow: document.documentElement.scrollWidth > innerWidth + 1, documentWidth: document.documentElement.scrollWidth, clippedCaptions, badImages };
      });
      results.push({ route,width,theme,...layout });
      if (important.has(route) || (width===1440 && theme==='light')) await page.screenshot({ path:`.qa/${route.replace('.html','')}-${width}-${theme}.png`, fullPage: true });
    }
  }
  console.log(`Rendered all ${pages.length} routes at ${width}px in both themes.`);
}
// Browser-level behavior checks use the actual built bundles.
await page.setViewportSize({ width:375,height:900 });
await page.goto('http://127.0.0.1:8080/index.html');
await page.getByRole('button', { name:'Menu', exact:false }).click();
await page.getByRole('navigation', { name:'Main navigation' }).waitFor({ state:'visible' });
await page.keyboard.press('Escape');
if (await page.locator('.menu-toggle').getAttribute('aria-expanded')!=='false') throw new Error('Menu Escape did not close');
await page.goto('http://127.0.0.1:8080/hanuman-lanka.html');
await page.locator('#reader-size').selectOption('large');
await page.locator('#save-chapter').click();
await page.reload();
if (await page.locator('#reader-size').inputValue()!=='large' || !(await page.locator('#resume-reading').isVisible())) throw new Error('Reader preferences did not persist');
await page.locator('.tale-contents a[href="#ring"]').click();
await page.waitForFunction(()=>{
  const chapter=document.querySelector('#ring').getBoundingClientRect().top;
  const header=document.querySelector('.site-header').getBoundingClientRect().bottom;
  return chapter>=header && chapter<header+100;
});
const anchorClearance = await page.evaluate(()=>document.querySelector('#ring').getBoundingClientRect().top-document.querySelector('.site-header').getBoundingClientRect().bottom);
if (anchorClearance < 0) throw new Error('Chapter anchor is covered by floating navigation');
await page.waitForFunction(()=>document.querySelector('.tale-contents a[href="#ring"]').getAttribute('aria-current')==='location');
const glass = await page.locator('.reader-tools').evaluate(el=>({blur:getComputedStyle(el).backdropFilter,radius:getComputedStyle(el).borderRadius}));
if (glass.blur!=='none' || glass.radius==='0px') throw new Error('Approved solid reader controls missing');
const cdp = await context.newCDPSession(page);
await cdp.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-transparency',value:'reduce'}]});
const solidFallback = await page.locator('.reader-tools').evaluate(el=>getComputedStyle(el).backdropFilter==='none' && getComputedStyle(el).backgroundColor.startsWith('rgb('));
if (!solidFallback) throw new Error('Reduced-transparency fallback missing');
await cdp.send('Emulation.setEmulatedMedia',{features:[]});
await page.getByRole('button',{name:/Switch to .* theme/}).click();
await page.waitForFunction(()=>!document.documentElement.classList.contains('theme-changing'));
await page.goto('http://127.0.0.1:8080/search.html?q=Hanuman%20Lanka');
await page.locator('.pagefind-ui__result').first().waitFor({ state:'visible',timeout:15000 });
const searchResults = await page.locator('.pagefind-ui__result-link').allTextContents();
if (!(await page.locator('.pagefind-ui__result-link[href$="hanuman-lanka.html"]').count())) throw new Error(`Hanuman reader missing from live search: ${searchResults.join(', ')}`);
await page.goto('http://127.0.0.1:8080/deities.html');
await page.locator('#directory-query').fill('Krishna');
if (await page.locator('.deity-index a[href="#shiva"]').isVisible()) throw new Error('Filtered index link still visible');
await page.goto('http://127.0.0.1:8080/family.html');
await page.evaluate(async()=>{await document.fonts.ready; await Promise.all([...document.images].map(async img=>{img.loading='eager';await img.decode();}));});
await page.emulateMedia({ media:'print' });
await page.pdf({ path:'.qa/family-companion.pdf',format:'A4',printBackground:true,margin:{top:'15mm',bottom:'15mm',left:'15mm',right:'15mm'} });
await page.emulateMedia({ media:'screen',reducedMotion:'reduce' });
await page.goto('http://127.0.0.1:8080/stories.html');
const reducedMotion = await page.locator('.collection-card img').first().evaluate(el=>getComputedStyle(el).transitionDuration);
await page.goto('http://127.0.0.1:8080/index.html');
await page.locator('.museum-film-link').hover();
if ((await page.locator('.museum-film-link').evaluate(el=>getComputedStyle(el).transform))!=='none') throw new Error('Reduced-motion link still moves');
await page.locator('.museum-film-link').focus();
if ((await page.locator('.museum-film-link').evaluate(el=>getComputedStyle(el).outlineStyle))==='none') throw new Error('Keyboard focus outline missing');
await page.setViewportSize({width:720,height:450});
await page.goto('http://127.0.0.1:8080/index.html');
const zoomEquivalentOverflow = await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);
const zoomFailures = [];
for (const route of pages) {
  await page.goto(`http://127.0.0.1:8080/${route}`);
  if(route==='museum-preview.html')await page.waitForURL(url=>url.pathname==='/'||url.pathname==='/index.html');
  const overflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > innerWidth + 1;
  });
  if (overflow) zoomFailures.push(route);
}
const noScriptContext = await browser.newContext({javaScriptEnabled:false,viewport:{width:375,height:900}});
const noScriptPage = await noScriptContext.newPage();
await noScriptPage.goto('http://127.0.0.1:8080/stories.html');
const storyCount=Object.keys(JSON.parse(await readFile('src/data/stories.json','utf8'))).length;
if (!(await noScriptPage.getByRole('navigation',{name:'Main navigation'}).isVisible()) || await noScriptPage.locator('.collection-card').count()!==storyCount) throw new Error('No-JavaScript navigation/content missing');
await noScriptContext.close();
const report = { results, runtimeErrors, searchResults, reducedMotion, anchorClearance, glass, solidFallback, zoomEquivalentOverflow, zoomFailures, note:'720 CSS-pixel reflow on every page approximates 200% browser zoom from 1440px. Native browser zoom and screen-reader audit not claimed.' };
await writeFile('.qa/browser-report.json',JSON.stringify(report,null,2));
await browser.close();
const failures=results.filter(result=>result.overflow||result.clippedCaptions.length||result.badImages.length);
console.log(JSON.stringify({scenarios:results.length,failures,runtimeErrors,searchResults,reducedMotion,zoomEquivalentOverflow},null,2));
if(failures.length||runtimeErrors.length||zoomEquivalentOverflow||zoomFailures.length) process.exitCode=1;
