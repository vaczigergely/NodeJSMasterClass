const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./lib/config');
const fs = require('fs');
const handlers = require('./lib/handlers');
const helpers = require('./lib/helpers');


const httpServer = http.createServer(function(req, res) {
    unifiedServer(req,res);
});

httpServer.listen(config.httpPort, function() {
    console.log(`The server is listening on port ${config.httpPort} in ${config.envName} mode`);
});


const httpsServerOptions = {
    'key' : fs.readFileSync('./https/key.pem'),
    'cert' : fs.readFileSync('./https/cert.pem')
};
const httpsServer = https.createServer(httpsServerOptions,function(req, res) {
    unifiedServer(req,res);
});

httpsServer.listen(config.httpsPort, function() {
    console.log(`The server is listening on port ${config.httpsPort} in ${config.envName} mode`);
});


const unifiedServer = function(req,res) {
    const baseURL =  req.protocol + '://' + req.headers.host + '/';
    const fullPath = new URL(req.url,baseURL);
    const path = fullPath.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');

    const method = req.method.toLocaleLowerCase();

    const searchParameters = new URLSearchParams(fullPath.searchParams)
    const queryStringObject = Object.fromEntries(searchParameters);
    //console.log(queryStringObject);

    const headers = req.headers;
    //console.log(headers);

    let decoder = new StringDecoder('utf-8');
    let buffer = '';
    req.on('data', function(data) {
        buffer += decoder.write(data);
    });
    req.on('end', function() {
        buffer += decoder.end();
  
        // Check the router for a matching path for a handler. If one is not found, use the notFound handler instead.
        const chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;
        
  
        // Construct the data object to send to the handler
        const data = {
          'trimmedPath' : trimmedPath,
          'queryStringObject' : queryStringObject,
          'method' : method,
          'headers' : headers,
          'payload' : helpers.parseJsonToObject(buffer)
        };

        console.log(router);
  
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
          console.log(trimmedPath,statusCode);
        });
  
    });
};


const router = {
    'ping' : handlers.ping,
    'users' : handlers.users
};