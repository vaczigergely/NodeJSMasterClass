const app = require('./../index');
const assert = require('assert');
const http = require('http');
const config = require('./../lib/config');

let api = {};

let helpers = {};
helpers.makeGetRequest = function(path,callback) {
    let requestDetails = {
        'protocol' : 'http:',
        'hostname' : 'localhost',
        'port' : config.httpPort,
        'method' : 'GET',
        'path' : path,
        'headers' : {
            'Content-Type' : 'application/json'
        }
    }
    let req = http.request(requestDetails,function(res) {
        callback(res); 
    });
    req.end();
};


api['app.init should start without throwing'] = function(done) {
    assert.doesNotThrow(function() {
        app.init(function(err) {
            done(); 
        });
    },TypeError);
};


api['/ping should respondto GET with 200'] = function(done) {
    helpers.makeGetRequest('/ping',function(res) {
        assert.strictEqual(res.statusCode,200);
        done(); 
    });
}


api['/api/users should respondto GET with 400'] = function(done) {
    helpers.makeGetRequest('/api/users',function(res) {
        assert.strictEqual(res.statusCode,400);
        done(); 
    });
}


api['A random path should respondto GET with 404'] = function(done) {
    helpers.makeGetRequest('/nonexisting/path',function(res) {
        assert.strictEqual(res.statusCode,404);
        done(); 
    });
}


module.exports = api;