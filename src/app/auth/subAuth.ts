import { SERVER_ID } from '../config';

export function authorizeSubscribe(client, topic, callback) {
    let clientId = client.id;

    const topics = topic.split('/');
    const thingId = topics[0];

    if (clientId === thingId) callback(null, true);
    else callback(`Miss match id`, false);
}
