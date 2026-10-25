import {readFile} from 'node:fs/promises';
export const site=JSON.parse(await readFile(new URL('../src/data/site.json',import.meta.url),'utf8'));
const origin=new URL(site.origin);
if(origin.protocol!=='https:'||origin.origin!==site.origin)throw new Error('site.origin must be an HTTPS origin without a path or trailing slash.');
export const absoluteUrl=value=>new URL(value,site.origin+'/').href;
export const pagePath=data=>data.page.url==='/index.html'?'/':data.page.url;
export const socialPath=data=>`/assets/social/${data.page.url.split('/').pop().replace(/\.html$/,'')||'index'}.jpg`;
export function structuredData(data){
  const article=Boolean(data.story||data.article);
  const canonical=absoluteUrl(pagePath(data));
  const website={'@type':'WebSite','@id':absoluteUrl('/#website'),url:absoluteUrl('/'),name:'Sanatan Heritage',inLanguage:'en'};
  const publisher={'@type':'Organization','@id':absoluteUrl('/#publisher'),name:'Sanatan Heritage',url:absoluteUrl('/'),logo:{'@type':'ImageObject',url:absoluteUrl('/assets/brand/icon-512.png'),width:512,height:512}};
  const page={'@type':article?'Article':'WebPage','@id':canonical+'#content',url:canonical,name:data.title,description:data.description,inLanguage:'en',isPartOf:{'@id':website['@id']},publisher:{'@id':publisher['@id']}};
  if(article)Object.assign(page,{headline:data.title.split('·')[0].trim(),image:absoluteUrl(socialPath(data)),mainEntityOfPage:canonical});
  return {'@context':'https://schema.org','@graph':[website,publisher,page]};
}
