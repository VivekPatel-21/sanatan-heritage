import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { createReadStream } from 'node:fs';
const root = path.resolve('dist');
const security=JSON.parse(await readFile('vercel.json','utf8')).headers[0].headers;
try { await stat(path.join(root, 'index.html')); } catch { console.error('Build the site before serving it: npm run build'); process.exit(1); }
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.webmanifest':'application/manifest+json', '.jpg':'image/jpeg', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.wasm': 'application/wasm', '.mp4':'video/mp4' };
const server = http.createServer(async (request, response) => {
  for(const {key,value} of security)response.setHeader(key,value);
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    const file = path.resolve(root, `.${pathname === '/' ? '/index.html' : pathname}`);
    if (!file.startsWith(root + path.sep)) { response.writeHead(403).end(); return; }
    let info;
    try { info=await stat(file);if(!info.isFile())throw new Error('Not a file'); }
    catch { response.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' }); response.end(await readFile(path.join(root, '404.html'))); return; }
    response.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
    response.setHeader('Accept-Ranges','bytes');
    if(request.headers.range){
      const range=/^bytes=(\d*)-(\d*)$/.exec(request.headers.range);
      let start,end;
      if(range&&(range[1]||range[2])){
        start=range[1]?Number(range[1]):Math.max(0,info.size-Number(range[2]));
        end=range[1]&&range[2]?Math.min(Number(range[2]),info.size-1):info.size-1;
      }
      if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start<0||start>=info.size||end<start){response.writeHead(416,{'Content-Range':`bytes */${info.size}`}).end();return;}
      response.writeHead(206,{'Content-Range':`bytes ${start}-${end}/${info.size}`,'Content-Length':end-start+1});
      if(request.method==='HEAD'){response.end();return;}
      createReadStream(file,{start,end}).on('error',()=>response.destroy()).pipe(response);return;
    }
    response.setHeader('Content-Length',info.size);
    if(request.method==='HEAD'){response.end();return;}
    createReadStream(file).on('error',()=>response.destroy()).pipe(response);
  } catch { response.writeHead(400).end('Bad request'); }
});
server.listen(8080, '127.0.0.1', () => console.log('Local: http://127.0.0.1:8080'));
