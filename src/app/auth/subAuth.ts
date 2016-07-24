import { SERVER_ID } from '../config';

export function authorizeSubscribe(client, topic, callback) {
    let clientId = client.id;

    if (clientId === SERVER_ID) return callback(null, true);

    const topics = topic.split('/');
    const thingId = topics[0];

    if (clientId === thingId) callback(null, true);
    else callback(`Miss match id`, false);
}
