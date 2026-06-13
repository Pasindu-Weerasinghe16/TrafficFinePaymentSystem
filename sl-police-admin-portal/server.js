const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3001;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  // Extract URL path and clean it
  let filePath = req.url.split('?')[0];
  if (filePath === '/') {
    filePath = '/index.html';
  }

  // Resolve to absolute path in the workspace
  let absolutePath = path.join(__dirname, filePath);

  // Security check: prevent directory traversal
  if (!absolutePath.startsWith(__dirname)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  // Check if file exists and is a file
  fs.stat(absolutePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // SPA Fallback: Serve index.html if file does not exist
      absolutePath = path.join(__dirname, 'index.html');
    }

    fs.readFile(absolutePath, (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading resource');
        return;
      }

      const ext = path.extname(absolutePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    });
  });
});

server.listen(PORT, () => {
  console.log(`SL Police Admin Portal running at http://localhost:${PORT}/`);
});

