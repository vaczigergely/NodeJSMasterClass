const http2 = require('http2');

const client = http2.connect('http://localhost:6000');

let req = client.request({
    ':path' : '/'
});

req.on('data', chunks => {
    str+=chunks;
});

let str = '';
req.on('end', () => {
    console.log(str);
});

req.end();