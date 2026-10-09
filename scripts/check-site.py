from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit,unquote
import xml.etree.ElementTree as ET
import json
project=Path(__file__).resolve().parents[1]
root=project/'dist' if (project/'dist/index.html').exists() else project
class Page(HTMLParser):
 def __init__(self,text):
  super().__init__();self.ids=[];self.links=[];self.h1=0;self.meta={};self.title=[];self.images=[];self.landmarks=set();self.feed(text)
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  self.landmarks.add(tag)
  if tag=='img':self.images.append(a)
  if tag=='title':self.title.append(tag)
  if 'id' in a:self.ids.append(a['id'])
  if tag=='h1':self.h1+=1
  for key in ['href','src']:
   if key in a:self.links.append(a[key])
  if tag=='meta':self.meta[a.get('property',a.get('name',''))]=a.get('content')
pages={f.name:Page(f.read_text()) for f in root.glob('*.html')};errors=[]
for name,p in pages.items():
 if p.h1!=1:errors.append(f'{name}: expected one h1')
 if len(p.ids)!=len(set(p.ids)):errors.append(f'{name}: duplicate IDs')
 for link in p.links:
  u=urlsplit(link)
  if u.scheme or u.netloc:continue
  target=unquote(u.path).lstrip('/') or name
  if not (root/target).exists():errors.append(f'{name}: missing {target}')
  elif u.fragment and target in pages and unquote(u.fragment) not in pages[target].ids:errors.append(f'{name}: missing anchor {link}')
 for image in p.images:
  if not image.get('alt','').strip():errors.append(f'{name}: image needs descriptive alt')
  if not image.get('width') or not image.get('height'):errors.append(f'{name}: image needs intrinsic dimensions')
  for candidate in image.get('srcset','').split(','):
   if candidate.strip() and not (root/candidate.strip().split()[0].lstrip('/')).exists():errors.append(f'{name}: missing responsive image')
 if not {'header','nav','main','footer'}.issubset(p.landmarks):errors.append(f'{name}: missing landmarks')
 if len(p.title)!=1:errors.append(f'{name}: expected a page title')
 for key in ['viewport','description','og:title','og:description','og:url','og:image','twitter:card']:
  if not p.meta.get(key):errors.append(f'{name}: missing {key}')
 for key in ['og:url','og:image']:
  if not p.meta.get(key,'').startswith('https://sanatan-heritage.vivopatel1304.chatgpt.site/'):errors.append(f'{name}: invalid {key}')
 if p.meta.get('og:image') and not (root/urlsplit(p.meta['og:image']).path.lstrip('/')).exists():errors.append(f'{name}: missing preview image')
assert (root/'stories.html').read_text().count('class="collection-source"')==8
assert all('ref-'+slug in pages['sources.html'].ids for slug in ['shiva-poison','rama-exile','hanuman-lanka','govardhana','mahishasura','lalita-bhandasura','bhagiratha-ganga','shiva-parvati'])
for term in json.loads((root/'data/glossary.json').read_text()):
 if term['id'] not in pages['glossary.html'].ids:errors.append(f"Missing glossary entry: {term['id']}")
ET.parse(root/'sitemap.xml')
assert (root/'pagefind/pagefind.js').exists()
if errors:raise SystemExit('\n'.join(errors))
print(f'Passed: {len(pages)} pages; local files and fragments; metadata and images; eight card citations; sitemap; search bundle.')
