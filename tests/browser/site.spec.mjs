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

test('header disclosures cover every public page and support keyboard dismissal',async({page})=>{
  await page.goto('/fourteen-lokas.html');
  const menu=page.locator('.menu-toggle');if(await menu.isVisible())await menu.click();
  const destinations=await page.locator('#site-nav a').evaluateAll(links=>links.map(a=>a.getAttribute('href')));
  for(const route of routes.filter(r=>!['404.html','museum-preview.html'].includes(r)))expect(destinations).toContain('/'+route);
  const groups=page.locator('.nav-group');
  for(let index=0;index<await groups.count();index++){
    const group=groups.nth(index);const summary=group.locator('summary');
    await summary.focus();await page.keyboard.press('Enter');await expect(group).toHaveAttribute('open','');
    expect(await page.locator('.nav-group[open]').count()).toBe(1);
    const bounds=await group.locator('.nav-dropdown').boundingBox();const size=page.viewportSize();
    expect(bounds.x).toBeGreaterThanOrEqual(0);expect(bounds.x+bounds.width).toBeLessThanOrEqual(size.width+1);
    const audit=await new AxeBuilder({page}).include('.site-header').withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();expect(audit.violations).toEqual([]);
    await page.keyboard.press('Tab');await expect(group.locator('a').first()).toBeFocused();
    await page.keyboard.press('Escape');await expect(group).not.toHaveAttribute('open','');await expect(summary).toBeFocused();
  }
  await groups.first().locator('summary').click();
  const headerBottom=await page.locator('.site-header').evaluate(el=>el.getBoundingClientRect().bottom);
  await page.mouse.click(2,Math.min(page.viewportSize().height-2,headerBottom+24));await expect(groups.first()).not.toHaveAttribute('open','');
  if(await menu.isVisible())await menu.click();
  await groups.first().locator('summary').click();await page.locator('#site-nav a[href="/creation-universe.html"]').click();await expect(page).toHaveURL(/creation-universe.html$/);
});

test('header and Fourteen Lokas remain usable without JavaScript',async({browser},info)=>{
  const context=await browser.newContext({javaScriptEnabled:false,viewport:info.project.use.viewport,colorScheme:info.project.use.colorScheme});
  const page=await context.newPage();await page.goto('/fourteen-lokas.html');
  await expect(page.locator('h1')).toContainText('Fourteen');
  await page.locator('.tale-chapter').last().scrollIntoViewIfNeeded();
  expect(await page.locator('.site-header').evaluate(el=>el.getBoundingClientRect().bottom)).toBeLessThanOrEqual(0);
  const discover=page.locator('.nav-group').first();await discover.locator('summary').click();
  await expect(discover.locator('a[href="/creation-universe.html"]')).toBeVisible();
  await discover.locator('a[href="/creation-universe.html"]').click();await expect(page).toHaveURL(/creation-universe.html$/);await context.close();
});

test('festival directory supports search, kind filters, URL restoration and empty recovery',async({page})=>{
  await page.goto('/festivals.html?festival=Diwali');
  const query=page.locator('#festival-query');const kind=page.locator('#festival-kind');
  await expect(query).toHaveValue('Diwali');await expect(page.locator('#calendar-deepavali')).toBeVisible();
  await expect(page.locator('#festival-count')).toContainText('calendar entries');
  await query.fill('zzzxnomatchingfestival');await expect(page.locator('#festival-empty')).toBeVisible();
  await page.locator('[data-festival-reset]').click();await expect(query).toBeFocused();await expect(query).toHaveValue('');await expect(kind).toHaveValue('all');
  expect(await page.locator('[data-festival-entry]:visible').count()).toBe(await page.locator('[data-festival-entry]').count());
  await query.fill('Ratha Yatra');await kind.selectOption('temple');await expect(page.locator('#calendar-ratha-yatra')).toBeVisible();
  await page.reload();await expect(query).toHaveValue('Ratha Yatra');await expect(kind).toHaveValue('temple');await expect(page.locator('#calendar-ratha-yatra')).toBeVisible();
  await page.locator('#calendar-ratha-yatra a[href^="/sources.html#"]').click();await expect(page).toHaveURL(/sources.html#festival-ratha-yatra$/);
});

test('one festival entry holds the expanded information and legacy links open it',async({page})=>{
  await page.goto('/festivals.html');
  for(const name of ['Maha Shivaratri','Navaratri','Hanuman Jayanti'])await expect(page.getByRole('heading',{name,exact:true})).toHaveCount(1);
  await expect(page.locator('[data-festival-entry]')).toHaveCount(31);
  const entry=page.locator('#calendar-deepavali');const disclosure=entry.locator('.festival-details');
  await disclosure.locator('summary').focus();await page.keyboard.press('Enter');await expect(disclosure).toHaveAttribute('open','');
  expect(await disclosure.locator('p').count()).toBeGreaterThanOrEqual(2);
  const audit=await new AxeBuilder({page}).include('#calendar-deepavali').withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();expect(audit.violations).toEqual([]);
  await page.keyboard.press('Space');await expect(disclosure).not.toHaveAttribute('open','');
  await page.goto('/festivals.html?festival=Deepavali#shivaratri-telling');
  await expect(page.locator('#calendar-shivaratri')).toBeVisible();await expect(page.locator('#calendar-shivaratri details')).toHaveAttribute('open','');
  await expect(page.locator('#shivaratri-telling')).toBeVisible();await expect(page.locator('#festival-query')).toHaveValue('');
  await page.locator('.journal-index a[href="#navaratri"]').click();await expect(page.locator('#calendar-navaratri details')).toHaveAttribute('open','');
});

test('rishi profiles connect stories, family links and wider narrative context',async({page})=>{
  await page.goto('/dhruva.html');await page.locator('.rishi-connection a[href="/great-rishis.html#narada"]').click();await expect(page).toHaveURL(/great-rishis.html#narada$/);
  await page.locator('#narada .rishi-reading-links a[href="/shiva-parvati.html"]').click();await expect(page).toHaveURL(/shiva-parvati.html$/);
  await page.locator('.rishi-connection a[href="/great-rishis.html#narada"]').click();await expect(page).toHaveURL(/great-rishis.html#narada$/);
  await page.locator('.tale-contents a[href="#bhrigu"]').click();await page.locator('#bhrigu .rishi-reading-links a[href="#markandeya"]').click();await expect(page).toHaveURL(/#markandeya$/);
  await page.locator('#markandeya .rishi-reading-links a[href="/fourteen-lokas.html"]').click();await expect(page).toHaveURL(/fourteen-lokas.html$/);
  await page.goto('/rama-exile.html');await expect(page.locator('.rishi-connection')).toContainText('wider Ramayana');await page.locator('.rishi-connection a[href$="#atri"]').click();await expect(page).toHaveURL(/great-rishis.html#atri$/);
});

test('Kapila and Devahuti can be found, read and traced to the supplied edition',async({page})=>{
  await page.goto('/stories.html?scripture=Bhagavata+Purana');
  await expect(page.locator('#story-kapila-devahuti')).toBeVisible();
  await page.locator('#story-kapila-devahuti .tale-card-link').click();
  await expect(page).toHaveURL(/kapila-devahuti.html$/);
  await expect(page.locator('.tale-chapter')).toHaveCount(6);
  await page.locator('.tale-contents a[href="#sankhya"]').click();
  await expect(page).toHaveURL(/#sankhya$/);
  await expect(page.locator('#sankhya')).toContainText(/prakriti/i);
  await page.locator('.tale-meta a[href="/sources.html#kapila-devahuti"]').click();
  await expect(page).toHaveURL(/sources.html#kapila-devahuti$/);
  await expect(page.locator('#kapila-devahuti')).toContainText('3.25.5–20');
});

test('the Avadhuta guide presents all twenty-four teachers in order with source links',async({page})=>{
  await page.goto('/stories.html');
  await page.locator('a[href="/avadhuta-teachers.html"]').last().click();
  await expect(page).toHaveURL(/avadhuta-teachers.html$/);
  const teachers=page.locator('.teacher-list > li');
  await expect(teachers).toHaveCount(24);
  await expect(teachers.first()).toContainText('Earth');
  await expect(teachers.last()).toContainText('Wasp and captive insect');
  await expect(page.locator('.teacher-list[start="1"] > li')).toHaveCount(8);
  await expect(page.locator('.teacher-list[start="9"] > li')).toHaveCount(9);
  await expect(page.locator('.teacher-list[start="18"] > li')).toHaveCount(7);
  await page.locator('.tale-contents a[href="#body-teacher"]').click();
  await expect(page).toHaveURL(/#body-teacher$/);
  await expect(page.locator('#body-teacher')).toContainText('outside the numbered list');
  await page.locator('.tale-meta a[href="/sources.html#avadhuta-teachers"]').click();
  await expect(page.locator('#avadhuta-teachers')).toContainText('11.7.33–35');
});
