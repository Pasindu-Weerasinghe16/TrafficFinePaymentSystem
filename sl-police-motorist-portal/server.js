const http = require('http');

const port = process.env.PORT || 3000;

const server = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  response.end('<h1>SL Police Motorist Portal</h1>');
});

server.listen(port, () => {
  console.log(`SL Police motorist portal listening on ${port}`);
});
