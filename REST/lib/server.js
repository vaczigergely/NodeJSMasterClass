const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');
const fs = require('fs');
const handlers = require('./handlers');
const helpers = require('./helpers');
const path = require('path');
const util = require('util');
const debug = util.debuglog('server');

const server = {};



server.httpServer = http.createServer(function(req, res) {
    server.unifiedServer(req,res);
});




server.httpsServerOptions = {
    'key' : fs.readFileSync(path.join(__dirname,'/../https/key.pem')),
    'cert' : fs.readFileSync(path.join(__dirname,'/../https/cert.pem'))
};
server.httpsServer = https.createServer(server.httpsServerOptions,function(req, res) {
    server.unifiedServer(req,res);
});



server.unifiedServer = function(req,res) {
    const baseURL =  req.protocol + '://' + req.headers.host + '/';
    const fullPath = new URL(req.url,baseURL);
    const path = fullPath.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');

    const method = req.method.toLocaleLowerCase();

    const searchParameters = new URLSearchParams(fullPath.searchParams)
    const queryStringObject = Object.fromEntries(searchParameters);
    //debug(queryStringObject);

    const headers = req.headers;
    //debug(headers);

    let decoder = new StringDecoder('utf-8');
    let buffer = '';
    req.on('data', function(data) {
        buffer += decoder.write(data);
    });
    req.on('end', function() {
        buffer += decoder.end();
  
        // Check the router for a matching path for a handler. If one is not found, use the notFound handler instead.
        const chosenHandler = typeof(server.router[trimmedPath]) !== 'undefined' ? server.router[trimmedPath] : handlers.notFound;
        
  
        // Construct the data object to send to the handler
        const data = {
          'trimmedPath' : trimmedPath,
          'queryStringObject' : queryStringObject,
          'method' : method,
          'headers' : headers,
          'payload' : helpers.parseJsonToObject(buffer)
        };
  
        // Route the request to the handler specified in the router
        chosenHandler(data,function(statusCode,payload){
  
          // Use the status code returned from the handler, or set the default status code to 200
          statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
  
          // Use the payload returned from the handler, or set the default payload to an empty object
          payload = typeof(payload) == 'object'? payload : {};
  
          // Convert the payload to a string
          const payloadString = JSON.stringify(payload);
  
          // Return the response
          res.setHeader('Content-Type', 'application/json');
          res.writeHead(statusCode);
          res.end(payloadString);

          if(statusCode == 200){
            debug('\x1b[32m%s\x1b[0m',method.toUpperCase()+' /'+trimmedPath+' '+statusCode);
          } else {
            debug('\x1b[31m%s\x1b[0m',method.toUpperCase()+' /'+trimmedPath+' '+statusCode);
          };
        });
  
    });
};


server.router = {
    'ping' : handlers.ping,
    'users' : handlers.users,
    'tokens' : handlers.tokens,
    'checks' : handlers.checks
};

server.init = function() {
    server.httpServer.listen(config.httpPort, function() {
        console.log('\x1b[36m%s\x1b[0m',`The server is listening on port ${config.httpPort} in ${config.envName} mode`);
    });

    server.httpsServer.listen(config.httpsPort, function() {
        console.log('\x1b[35m%s\x1b[0m',`The server is listening on port ${config.httpsPort} in ${config.envName} mode`);
    });
};

module.exports = server;