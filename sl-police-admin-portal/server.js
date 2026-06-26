const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3001;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon', '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  let filePath = req.url.split('?')[0];
  if (filePath === '/') filePath = '/index.html';
  let abs = path.join(__dirname, filePath);
  if (!abs.startsWith(__dirname)) { res.writeHead(403); res.end('Forbidden'); return; }
  fs.stat(abs, (err, stats) => {
    if (err || !stats.isFile()) abs = path.join(__dirname, 'index.html');
    fs.readFile(abs, (err2, data) => {
      if (err2) { res.writeHead(500); res.end('Error'); return; }
      const ext = path.extname(abs).toLowerCase();
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
      res.end(data);
    });
  });
});

server.listen(PORT, () => console.log(`Admin Portal running at http://localhost:${PORT}/`));
