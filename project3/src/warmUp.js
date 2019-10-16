// warmUp.js

const net = require('net');
const HOST = '127.0.0.1';
const PORT = 8080;

const server = net.createServer((sock) => {
  sock.on('data', function() {
      sock.write("HTTP/1.1 200\r\nContent-Type: text/html\r\n\r\n <em>hello</em> <strong>world!</strong>");
      sock.end();
  });
});

server.listen(PORT);

