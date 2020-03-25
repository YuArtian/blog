const http = require('http');
const url = require('url');
const util = require('util');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:8080');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  const { pathname } = url.parse(req.url, true);
  if (pathname === '/givemeacookie') {
    console.log('接到请求，种下cookie');
    console.log('req header',req.headers);
    res.setHeader('set-cookie', ['cookie=aCookieFromServer']);
    res.end(JSON.stringify({result: 'cookie has send !'}));
  } else {
    res.end('HELLO');
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
