import { SERVER_ID } from '../config';

export function authenticate(client, username, password, callback) {
    let clientId = client.id;

    if (clientId === SERVER_ID)
        return callback(null, true);


    // Allow everyone to connect for now
    callback(null, true);
    // callback(null, false);
}
