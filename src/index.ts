import mosca = require('mosca');

import {
    authorizePublish,
    authorizeSubscribe,
    authenticate
} from './auth';

var ascoltatore = {
    //using ascoltatore
    type: 'mongo',
    url: 'mongodb://localhost:27017/mqtt',
    pubsubCollection: 'ascoltatori',
    mongo: {}
};

var settings = {
    port: 1883,
    backend: ascoltatore
};

var server = new mosca.Server(settings);

server.on('clientConnected', function(client) {
    console.log('client connected', client.id);
});

// fired when a message is received
server.on('published', function(packet, client) {
    let topic = packet.topic;
    let payload = packet.payload.toString();

    if (topic[0] === '$') return;

    let clientId = client.id;

    console.log(`${clientId}->${topic}: ${payload}`);
});

server.on('ready', setup);

// fired when the mqtt server is ready
function setup() {
    server.authenticate = authenticate;
    server.authorizePublish = authorizePublish;
    server.authorizeSubscribe = authorizeSubscribe;
    
    console.log('*** MeteMQ Broker is up and running ***');
}
