import * as shortid from 'shortid';
import { SERVER_ID } from '../config';
import { Broker } from '../broker';

let broker = Broker.getInstance();

export async function authenticate(client, username, password: Buffer, callback) {
    const clientId = client.id;

    // Server authentication
    if (clientId === SERVER_ID)
        return serverAuth(username, password, callback);

    // Client ID is thingId if the client is not server
    const thingId = clientId;
    // Generate unique ID
    const msgId = shortid.generate();
    // Send $connect message to server
    const payload = {
        userId: username,
        password: password ? password.toString() : password
    }
    await broker.publish(`${thingId}/$connect/${msgId}`, payload);

    let error;
    try {
        // Receive $connack message
        let result = await broker.when(`${thingId}/$connack/${msgId}`);
        let connack: boolean = result.payload;
        if (!connack) error = 'Server refused to connect';
    } catch (e) {
        // SERVER_RESPONSE_TIMEOUT
        error = e;
    }
    // Authenticate the thing
    if (error) callback(error, false);
    else callback(null, true);
}

function serverAuth(username, password, callback) {
    callback(null, true);
}
