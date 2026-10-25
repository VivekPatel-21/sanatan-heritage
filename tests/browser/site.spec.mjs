import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {readdir} from 'node:fs/promises';
const routes=(await readdir('dist')).filter(name=>name.endsWith('.html'));
test.beforeEach(async({page},info)=>{
  await page.addInitScript(theme=>{if(!localStorage.getItem('sanatan-theme'))localStorage.setItem('sanatan-theme',theme);},info.project.use.colorScheme);
});
for(const route of routes)test(`${route}: layout, metadata, security and accessibility`,async({page})=>{
  const runtime=[];const violations=[];
  page.on('pageerror',e=>runtime.push(String(e)));
  await page.addInitScript(()=>document.addEventListener('securitypolicyviolation',event=>{window.cspErrors??=[];window.cspErrors.push({directive:event.violatedDirective,blocked:event.blockedURI});}));
  const response=await page.goto('/'+route,{waitUntil:'networkidle'});
  if(route==='museum-preview.html')await page.waitForURL(url=>url.pathname==='/');
  await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(async img=>{img.loading='eager';try{await img.decode();}catch{}}));});
  expect(response.headers()['x-content-type-options']).toBe('nosniff');
  expect(response.headers()['content-security-policy']).toContain("script-src 'self'");
  expect(await page.locator('meta[property="og:image"]').getAttribute('content')).toMatch(/\/assets\/social\/[^/]+\.jpg$/);
  expect(await page.locator('script[type="application/ld+json"]').evaluate(el=>JSON.parse(el.textContent)['@context'])).toBe('https://schema.org');
  const layout=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth+1,broken:[...document.images].filter(img=>!img.complete||!img.naturalWidth).map(img=>img.src),clipped:[...document.querySelectorAll('figure')].filter(f=>{const c=f.querySelector('figcaption');return c&&getComputedStyle(f).overflow==='hidden'&&c.getBoundingClientRect().bottom>f.getBoundingClientRect().bottom+1;}).length,csp:window.cspErrors||[]}));
  expect(layout).toEqual({overflow:false,broken:[],clipped:0,csp:[]});expect(runtime).toEqual([]);
  const audit=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
  violations.push(...audit.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})));
  expect(violations).toEqual([]);
});
test('search counts and keyboard navigation',async({page})=>{
  await page.goto('/search.html?q=Hanuman');await page.locator('.pagefind-ui__result-link[href$="hanuman-lanka.html"]').waitFor();
  await expect(page.locator('#search-status')).toContainText(/results?/i);
  await page.locator('.pagefind-ui__search-input').fill('zzzxnonexistentstory');
  await expect(page.locator('#search-status')).toContainText(/no results|0 results/i);
  if(await page.locator('.menu-toggle').isVisible()){await page.locator('.menu-toggle').click();await page.keyboard.press('Escape');await expect(page.locator('.menu-toggle')).toBeFocused();}
});
test('mobile browser theme metadata follows the chosen theme',async({page})=>{
  await page.goto('/');const meta=page.locator('meta[name="theme-color"]');const initial=await meta.getAttribute('content');
  await page.locator('.theme-toggle').click();await expect(meta).not.toHaveAttribute('content',initial);
  const chosen=await meta.getAttribute('content');await page.reload();await expect(meta).toHaveAttribute('content',chosen);
});
