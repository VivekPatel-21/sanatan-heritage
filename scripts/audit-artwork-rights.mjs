import {readFile,writeFile,mkdir} from 'node:fs/promises';
const csv=await readFile('docs/ASSET_RIGHTS_REVIEW.csv','utf8');
const lines=csv.trim().split(/\r?\n/).slice(1).filter(Boolean);
const statuses=['needs-owner-confirmation','generation-provenance-recorded','owner-approved','owner-authorized-publication','owner-authorized-for-this-site'];
const counts=Object.fromEntries(statuses.map(s=>[s,0]));
for(const line of lines){
  const recorded=statuses.filter(s=>line.includes(','+s+','));
  if(recorded.length!==1)throw new Error('Artwork record has no single recognized status: '+line.slice(0,100));
  counts[recorded[0]]++;
}
const summary={total:lines.length,statuses:counts,clearedByAudit:false,note:'Pending records require verified owner evidence; site caption removal does not change licensing.'};
await mkdir('.qa',{recursive:true});
await writeFile('.qa/artwork-rights-summary.json',JSON.stringify(summary,null,2));
console.log('Artwork provenance audit:',JSON.stringify(summary));
