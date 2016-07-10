import { Broker } from './broker';
import { EventHandler } from './event';

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

var server = Broker.getInstance(settings);

// fired when a message is received
server.on('published', function(packet, client) {
    let topic = packet.topic;
    let payload = packet.payload.toString();

    // Ignore topic starts with '$'
    // if (topic[0] === '$') return;

    // When broker publishes a message, client object is undefined.
    if (client === undefined) {
        let topics = topic.split('/');
        EventHandler.process(payload, topics[2], topics[3]);
        return;
    };

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


export { server };
