import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve('dist');
try { await stat(path.join(root, 'index.html')); } catch { console.error('Build the site before serving it: npm run build'); process.exit(1); }
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.wasm': 'application/wasm' };
const server = http.createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    const file = path.resolve(root, `.${pathname === '/' ? '/index.html' : pathname}`);
    if (!file.startsWith(root + path.sep)) { response.writeHead(403).end(); return; }
    let content;
    try { content = await readFile(file); }
    catch { response.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' }); response.end(await readFile(path.join(root, '404.html'))); return; }
    response.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
    response.end(content);
  } catch { response.writeHead(400).end('Bad request'); }
});
server.listen(8080, '127.0.0.1', () => console.log('Local: http://127.0.0.1:8080'));
