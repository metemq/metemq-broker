import { server } from '../index';

export function authorizeSubscribe(client, topic, callback) {
    const topics = topic.split('/');
    const thingId = topics[0];

    const subAuthMsg = {
        topic: topic,
        thingId: thingId
    };

    server.publish({
        topic: '$SERVER/auth/sub',
        payload: JSON.stringify(subAuthMsg),
        qos: 1,
        retain: false
    })

    callback(null, true);
}
