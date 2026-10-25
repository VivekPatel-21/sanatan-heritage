import {writeFile,mkdir} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
const {chromium}=await import(process.env.SANATAN_PLAYWRIGHT_PATH?pathToFileURL(process.env.SANATAN_PLAYWRIGHT_PATH).href:'playwright');
const browser=await chromium.launch({channel:'chrome',headless:true});
const results=[];
try{
  for(const width of [375,768,1440]){
    const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});
    const page=await context.newPage();const cdp=await context.newCDPSession(page);
    await cdp.send('Network.enable');await cdp.send('Network.setCacheDisabled',{cacheDisabled:true});
    await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:200000,uploadThroughput:100000});
    await page.addInitScript(()=>{
      window.lab={lcp:0,cls:0,shifts:[]};
      new PerformanceObserver(list=>{for(const entry of list.getEntries())window.lab.lcp=entry.startTime;}).observe({type:'largest-contentful-paint',buffered:true});
      new PerformanceObserver(list=>{for(const entry of list.getEntries())if(!entry.hadRecentInput){window.lab.cls+=entry.value;window.lab.shifts.push({value:entry.value,time:entry.startTime,sources:entry.sources?.map(s=>({element:s.node?.className||s.node?.nodeName,previous:s.previousRect.toJSON(),current:s.currentRect.toJSON()}))});}}).observe({type:'layout-shift',buffered:true});
    });
    await page.goto('http://127.0.0.1:8080/',{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(1000);
    results.push(await page.evaluate(width=>({width,lcpMs:Math.round(window.lab.lcp),cls:Number(window.lab.cls.toFixed(4)),shifts:window.lab.shifts,transferredBytes:performance.getEntriesByType('resource').reduce((sum,r)=>sum+r.transferSize,0),videoRequested:performance.getEntriesByType('resource').some(r=>r.name.endsWith('.mp4')),note:'Local cold-load lab: 150ms latency, 200kB/s download, reduced motion. Not field Core Web Vitals; INP not measured.'}),width));
    await context.close();
  }
  await mkdir('.qa',{recursive:true});await writeFile('.qa/performance-report.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));
}finally{await browser.close();}
