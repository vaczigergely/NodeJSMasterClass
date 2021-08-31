const dgram = require('dgram');

const client = dgram.createSocket('udp4');

let messageStream = 'This is the message';
let messageBuffer = Buffer.from(messageStream);

client.send(messageBuffer,6000,'localhost', (err) => {
    client.close();
});