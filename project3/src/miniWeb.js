// miniWeb.js
// define your Request, Response and App objects here

const net = require('net');
const HOST = '127.0.0.1';
const http=require('http');
const PORT = 8080;

  class Request{
  constructor(httpRequest){
    let toParse = httpRequest.split("\r\n");

    //find method and path
    let firstLine = (toParse[0].split(" "));
    this.method = firstLine[0];
    this.path = firstLine[1];

    //find body
    let length = toParse.length;
    this.body = toParse[length - 1];

    //find header(s) -- incomplete
    let heads = {};
    let numOfHeaders = toParse.length - 3;
    let i = 1;
    let headerCurr = []; "";
    let curr = "";
    
    while (i <= numOfHeaders){
      headerCurr = toParse[i].split(" ");
      curr = (headerCurr[0].substr(0, (headerCurr[0].length - 1)));
      heads[curr]= headerCurr[1];

      i++;
    }
    this.headers = heads;


    this.toString = function(){
      return httpRequest +"";
    };
    }

  }

  class Response{ 
    constructor(socket){

    this.sock = socket;
    this.headers = {};
    this.body = socket.body;

    let statusCodes = {
      '200': ' OK\r\n',
      '404': ' Not Found\r\n',
      '500': ' Internal Server Error\r\n',
      '301': ' Moved Permanently\r\n',
      '302': ' Found\r\n',
      '303': ' See Other\r\n',
      '400': ' Bad Request\r\n'
    };
    this.statusCode = socket.statusCode;
  
    //set headers
    this.setHeader = function(name, value){
      this.headers[name] = value;
    };

    //sends data to client
    this.write = function(data){
      this.sock.write(data);
    };

    //sends data and ends the connection
    this.end = function(s){
      this.sock.end(s);
    };

    //sets the statusCode and the body of this Request object, sends the valid
    //http response to client, then closes the connection
    this.send = function(statusCode, body){
      let result = "HTTP/1.1" + statusCode + "\r\n";
      for (let i=0; i<this.headers.length; i++){
        result += this.headers[i] + "\n";
      }
      if (typeof body !== 'undefined'){
        this.body = body;
        result+= this.body;
      }
      
      this.statusCode = statusCode;
      this.end(result);
    }

    //sets the statusCode, and writes everything but the body -- leaves 
    //connection open
    this.writeHead = function(statusCode){
      this.statusCode = statusCode;
      this.write('HTTP/1.1 ' + statusCode+' OK\r\n' + this.headers +'\r\n\r\n');
    };

    //redirects the supplied url using the supplied status code
    this.redirect = function(statusCode, url){
      if (isNaN(statusCode)){
        this.setHeader("Location", statusCode);
        this.statusCode = 301;
      }
      else {
        this.setHeader("Location", url);
        this.statusCode = 302;
      }
      this.end(this.statusCode, this.url);
    };

    //toString
    this.toString = function(){
      let result = "HTTP/1.1 "+ this.statusCode + statusCodes[this.statusCode];
      let key, i = 0;
      for (key in this.headers){
        if (typeof this.headers[key] !== 'undefined')
            result += key +": "+this.headers[key] + "\r\n";
      }
      result+='\r\n';


      if (typeof this.body !== 'undefined')
        result+= this.body;

      return result;

    };

    this.setInput = function(contentType, err, data) {
      this.setHeader("Content-Type", contentType);
      this.writeHead(200);
      this.write(data);
      this.end();
    };

    this.sendFile = function(fileName){
      const fs = require('fs');

      let extAndFileTypes = {
        'jpeg': 'image/jpeg',
        'png': 'image/jpeg',
        'gif': 'image/gif',
        'html': 'text/html',
        'css': 'text/css',
        'txt': 'text/plain'
      };
      const path = require('path');
      let filePath = path.resolve(__dirname, path.resolve("../public"));
      filePath+=fileName;

      let split = filePath.split('.');
      let extension = split[1];
      this.contentType = extAndFileTypes[extension];

      if (extension === 'txt' || extension === 'html'){
        fs.readFile(filePath, {'encoding': 'utf8'}, this.setInput.bind(this, this.contentType));
      }
      else {
        fs.readFile(filePath, {}, this.setInput.bind(this, this.contentType));
      }

    };

  }
}

class App{
	constructor (){
		const net = require('net');
		const HOST = '127.0.0.1';
		const PORT = 8080;

		this.server = net.createServer(this.handleConnection.bind(this));
		this.routes = {};
    this.server.listen(PORT, HOST);
	};

  get(path, cb){
    this.routes[path] = cb;
  };

  listen(port, host){
    this.server.listen(port, host);
  };

  handleConnection(sock){
    sock.on('data', this.handleRequestData.bind(this, sock));
  };

  //helper function to wrap a status and body (from class notes)
  createResponse(status, body) {
      return `HTTP/1.1 ${status} OK
  Content-Type: text/html

  ${body}`;
  };

  handleRequestData(sock, binaryData){
    const req = new Request(binaryData + '');
    const res = new Response(sock);

    //make sure that urls with and without a trailing slash (/) map to the same function
    if (req.path.length > 1 && req.path.charAt(req.path.length - 1) === '/')
      req.path = path.substr(0, req.path.length - 1);
    
    if(this.routes[req.path]) {
      this.routes[req.path](req, res);
    }
    //if the path doesn't exist in this.routes, then send back a 404  
    else {

      res.write("HTTP/1.1 200\r\nContent-Type: text/html\r\n\r\n <strong>404 Page not Found.... oops!</strong>");
      res.end();
    }

    sock.on('close', this.logResponse.bind(this, req, res));

  };
    
  logResponse(req, res){
   let statusCodes = {
      '200': ' OK',
      '404': ' Not Found',
      '500': ' Internal Server Error',
      '301': ' Moved Permanently',
      '302': ' Found',
      '303': ' See Other',
      '400': ' Bad Request'
    };

    console.log("" + req.method + " " + req.path + " " +res.statusCode+ statusCodes[res.statusCode]);
  };


}

//export
module.exports = {Request, Response, App};