declare module "mosca" {
    import {EventEmitter} from 'events';

    class Server extends EventEmitter {
        constructor(options?);

        authenticate: (client, username, password, callback) => void;
        authorizePublish: (client, topic, payload, callback) => void;
        authorizeSubscribe: (client, topic, callback) => void;
    }
}
