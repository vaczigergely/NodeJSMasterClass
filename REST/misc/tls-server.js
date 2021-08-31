const tls = require('tls');
const fs = require('fs');
const path = require('path');

const options = {
    'key' : fs.readFileSync(path.join(__dirname,'/../https/key.pem')),
    'cert' : fs.readFileSync(path.join(__dirname,'/../https/cert.pem'))
};


const server = tls.createServer(options, (connection) => {
    let outboundMessage = 'pong';
    connection.write(outboundMessage);

    connection.on('data',(inboundMessage) => {
        let messageString = inboundMessage.toString();
        console.log(`I wrote ${outboundMessage} and they said ${messageString}`);
    });
});

server.listen(6000);