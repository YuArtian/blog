const http = require('http');
const url = require('url')
const util = require('util')

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { pathname, query } = url.parse(req.url, true);
  if (pathname === '/mock') {
    console.log('mock');
    //随机时间
    let time = Math.random() * 1000
    console.log(`接受到第 ${query.index} 个模拟请求, ${time} ms 后响应`)
    setTimeout(_ => {
      console.log(`响应第 ${query.index} 个模拟请求`)
      res.end(query.index)
    }, time)
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
