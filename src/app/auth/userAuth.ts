import * as shortid from 'shortid';
import { SERVER_ID } from '../config';
import { Broker } from '../broker';

let broker = Broker.getInstance();

export async function authenticate(client, username, password, callback) {
    const clientId = client.id;

    // Server authentication
    if (clientId === SERVER_ID) return callback(null, true);

    // Client ID is thingId if the client is not server
    const thingId = clientId;
    // Generate unique ID
    const msgId = shortid.generate();
    // Send $connect message to server
    await broker.publish(`${thingId}/$connect/${msgId}`);

    let error;
    try {
        // Receive $connack message
        let connack: boolean = await broker.when(`${thingId}/$connack/${msgId}`);
        if (!connack) error = 'Server refused to connect';
    } catch (e) {
        // SERVER_RESPONSE_TIMEOUT
        error = e;
    }
    // Authenticate the thing
    if (error) callback(error, false);
    else callback(null, true);
}
