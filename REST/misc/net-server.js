const net = require('net');

const server = net.createServer((connection) => {
    let outboundMessage = 'pong';
    connection.write(outboundMessage);

    connection.on('data',(inboundMessage) => {
        let messageString = inboundMessage.toString();
        console.log(`I wrote ${outboundMessage} and they said ${messageString}`);
    });
});

server.listen(6000);