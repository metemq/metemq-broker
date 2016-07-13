import { Broker } from './broker';
import { EventHandler } from './event';

import {
    authorizePublish,
    authorizeSubscribe,
    authenticate
} from './auth';

const server = Broker.getInstance();

// fired when a message is received
server.on('published', function(packet, client) {
    let topic = packet.topic;
    let payload = packet.payload.toString();

    // When broker publishes a message, client object is undefined.
    if (client === undefined || client === null) {
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
