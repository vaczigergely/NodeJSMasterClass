const net = require('net');

let outboundMessage = 'ping';

const client = net.createConnection({ 'port' : 6000 }, () =>{
    client.write(outboundMessage);
});

client.on('data', (inboundMessage) => {
    let messageString = inboundMessage.toString();
    console.log(`I wrote ${outboundMessage} and they said ${messageString}`);
    client.end();
})