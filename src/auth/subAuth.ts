import { server } from '../index';
import { SERVER_ID } from '../config';

export function authorizeSubscribe(client, topic, callback) {
    let clientId = client.id;

    const topics = topic.split('/');
    const thingId = topics[0];

    const subAuthMsg = {
        topic: topic,
        thingId: thingId
    };

    if (clientId !== SERVER_ID) {
        server.publish({
            topic: '$SERVER/auth/sub',
            payload: JSON.stringify(subAuthMsg),
            qos: 1,
            retain: false
        })
    };

    callback(null, true);
}
