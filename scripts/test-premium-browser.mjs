import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
const {chromium}=await import(process.env.SANATAN_PLAYWRIGHT_PATH?pathToFileURL(process.env.SANATAN_PLAYWRIGHT_PATH).href:'playwright');
await mkdir('.qa',{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const context=await browser.newContext({reducedMotion:'reduce'});
const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(String(e)));
const focus=JSON.parse(await readFile('design-assets/video-focus.json','utf8'));
const framing=[];
try{
  for(const [width,height] of [[375,900],[768,1024],[1440,900],[2560,1440]]){
    await page.setViewportSize({width,height});await page.goto('http://127.0.0.1:8080/');
    await page.evaluate(async()=>{const v=document.querySelector('video');v.load();if(v.readyState<1)await new Promise((resolve,reject)=>{v.addEventListener('loadedmetadata',resolve,{once:true});v.addEventListener('error',reject,{once:true});});});
    for(const time of [0,.5,1,3,5,6,8,9,10,11,11.9]){
      await page.evaluate(async time=>{const v=document.querySelector('video');v.pause();if(Math.abs(v.currentTime-time)>.001){await new Promise(resolve=>{v.addEventListener('seeked',resolve,{once:true});v.currentTime=Math.min(time,v.duration-.01);});}else v.dispatchEvent(new Event('seeked'));},time);
      await page.waitForTimeout(60);
      const actual=await page.evaluate(()=>{const film=document.querySelector('.museum-film'),v=film.querySelector('video'),f=film.getBoundingClientRect(),r=v.getBoundingClientRect();return{time:v.currentTime,source:v.currentSrc,x:Number(film.dataset.focusX),y:Number(film.dataset.focusY),width:r.width,height:r.height,filmWidth:f.width,filmHeight:f.height,left:r.left-f.left,top:r.top-f.top};});
      const end=focus.findIndex(p=>p[0]>=actual.time);const b=focus[end<0?focus.length-1:end],a=focus[Math.max(0,(end<0?focus.length-1:end)-1)];const mix=b[0]===a[0]?0:(actual.time-a[0])/(b[0]-a[0]);
      const targetX=a[1]+(b[1]-a[1])*mix,targetY=a[2]+(b[2]-a[2])*mix;
      const errorX=Math.abs(actual.left+actual.width*targetX-actual.filmWidth/2),errorY=Math.abs(actual.top+actual.height*targetY-actual.filmHeight/2);
      assert.ok(errorX<3&&errorY<3,`Shrine centre drift at ${width}px, ${time}s: ${errorX}, ${errorY}`);
      assert.ok(actual.left<=1&&actual.top<=1&&actual.left+actual.width>=actual.filmWidth-1&&actual.top+actual.height>=actual.filmHeight-1,'Video must cover the opening without gaps');
      framing.push({width,height,time,errorX,errorY});
      if([0,9,11.9].includes(time))await page.locator('.museum-film').screenshot({path:`.qa/film-${width}-${time}.jpg`});
    }
  }
  await page.setViewportSize({width:375,height:900});
  await page.goto('http://127.0.0.1:8080/reading-library.html');
  await page.waitForSelector('.library-transfer:not([hidden])');
  await page.evaluate(()=>SHReading.set('/hanuman-lanka.html',{saved:true,bookmark:'court'}));
  const downloadPromise=page.waitForEvent('download');await page.locator('#library-export').click();const download=await downloadPromise;await download.saveAs('.qa/library-roundtrip.json');
  await page.evaluate(()=>SHReading.clear());
  await page.locator('#library-import').setInputFiles('.qa/library-roundtrip.json');await page.waitForFunction(()=>SHReading.get('/hanuman-lanka.html').saved===true);
  await page.locator('#library-import').setInputFiles({name:'invalid.json',mimeType:'application/json',buffer:Buffer.from('{bad json')});await page.waitForFunction(()=>document.querySelector('#library-transfer-status').textContent.includes('not valid JSON'));
  assert.equal(await page.evaluate(()=>SHReading.get('/hanuman-lanka.html').saved),true);
  await page.goto('http://127.0.0.1:8080/hindi.html');assert.equal(await page.locator('html').getAttribute('lang'),'hi');await page.screenshot({path:'.qa/hindi-mobile.png',fullPage:true});
  await page.goto('http://127.0.0.1:8080/search-hindi.html?q=ध्रुव');await page.locator('.pagefind-ui__result-link[href$="dhruva-hindi.html"]').waitFor({timeout:15000});
  await page.goto('http://127.0.0.1:8080/contact.html');await page.locator('#contact-message').fill('A source correction to discuss.');assert.equal(await page.locator('#contact-draft').evaluate(form=>form.checkValidity()),true);assert.equal(await page.locator('a[href="mailto:shreembala@gmail.com"]').count(),1);await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:'.qa/contact-mobile.png',fullPage:true});
  const response=await page.request.get('http://127.0.0.1:8080/assets/video/ambaji-centered-mobile.mp4',{headers:{Range:'bytes=0-1023'}});assert.equal(response.status(),206);assert.equal((await response.body()).length,1024);
  assert.deepEqual(errors,[]);
  await writeFile('.qa/premium-browser-report.json',JSON.stringify({framing,libraryRoundTrip:true,invalidImportPreservesState:true,hindiSearch:true,contact:true,videoRanges:true,errors},null,2));
  console.log(`Passed: ${framing.length} shrine-framing samples across four viewport sizes; library download/import; invalid import; Hindi search; contact; video range delivery.`);
}finally{await browser.close();}
