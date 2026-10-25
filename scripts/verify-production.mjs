import assert from 'node:assert/strict';
import {site} from './site-config.mjs';
const expected=process.env.EXPECTED_REVISION;
if(!expected)throw new Error('Set EXPECTED_REVISION to the GitHub commit being deployed.');
let release;
for(let attempt=0;attempt<40;attempt++){
  try{const response=await fetch(site.origin+'/release.json?revision='+expected,{cache:'no-store',signal:AbortSignal.timeout(15000)});if(response.ok){release=await response.json();if(release.revision===expected)break;}}catch{/* Vercel may still be building the new production version. */}
  if(attempt===39)throw new Error('Vercel has not served the expected commit. Check the connected project production branch and deployment logs.');
  await new Promise(resolve=>setTimeout(resolve,10000));
}
assert.equal(release.origin,site.origin);
const response=await fetch(site.origin+'/',{signal:AbortSignal.timeout(15000)});assert.equal(response.status,200);
assert.equal(response.headers.get('x-content-type-options'),'nosniff');
assert.equal(response.headers.get('referrer-policy'),'strict-origin-when-cross-origin');
assert.ok(response.headers.get('content-security-policy')?.includes("script-src 'self'"));
const html=await response.text();assert.ok(html.includes(site.origin+'/assets/social/index.jpg'));assert.ok(html.includes('application/ld+json'));
const image=await fetch(site.origin+'/assets/social/index.jpg');assert.ok(image.ok);assert.ok(image.headers.get('content-type')?.includes('image/jpeg'));assert.ok((await image.arrayBuffer()).byteLength<300000);
console.log(`Verified Vercel production commit ${expected}, origin, security headers, structured data and JPEG preview.`);
