import { SERVER_ID } from '../config';

export function authorizePublish(client, topic, payload, callback) {
    let levels = topic.split('/');
    let thingId = levels[0];
    let clientId = client.id;

    // Allow every publication for server
    if (clientId === SERVER_ID)
        return callback(null, true);

    // Thing can only publish topics begin with their IDs
    if (clientId !== thingId)
        return callback('You can only publish topics begin with your ID', false);

    // Allow things to publish topics begin with their IDs
    if (clientId === thingId)
        return callback(null, true);

    // Reject any other cases
    callback(null, false);
}
