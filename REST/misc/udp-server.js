const dgram = require('dgram');

const server = dgram.createSocket('udp4');

server.on('message', (messageBuffer,sender) => {
    let messageString = messageBuffer.toString();
    console.log(messageString);
});

server.bind(6000);