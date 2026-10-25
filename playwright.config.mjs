import {defineConfig} from '@playwright/test';
export default defineConfig({
  testDir:'./tests/browser',fullyParallel:true,workers:process.env.CI?2:3,retries:process.env.CI?1:0,timeout:45000,
  reporter:[['list'],['html',{outputFolder:'.qa/playwright-report',open:'never'}]],outputDir:'.qa/test-results',
  use:{baseURL:'http://127.0.0.1:8080',headless:true,channel:process.env.CI?undefined:'chrome',reducedMotion:'reduce',trace:'retain-on-failure'},
  projects:[375,768,1440].flatMap(width=>['light','dark'].map(colorScheme=>({name:`${width}-${colorScheme}`,use:{viewport:{width,height:900},colorScheme}}))),
  webServer:{command:`"${process.execPath}" scripts/serve.mjs`,url:'http://127.0.0.1:8080',reuseExistingServer:!process.env.CI}
});
