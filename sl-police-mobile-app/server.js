const http = require('http');

const port = process.env.PORT || 8082;

const server = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' });
  response.end('SL Police mobile app container is running');
});

server.listen(port, () => {
  console.log(`SL Police mobile app listening on ${port}`);
});
