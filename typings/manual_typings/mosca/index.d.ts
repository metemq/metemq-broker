declare module "mosca" {
    import {EventEmitter} from 'events';

    class Server extends EventEmitter {
        constructor(options?);

        authenticate: (client, username, password, callback) => void;
        authorizePublish: (client, topic, payload, callback) => void;
        authorizeSubscribe: (client, topic, callback) => void;

        publish(packet: MqttPacket, callback?: () => void);
    }

    interface MqttPacket {
        topic: string;
        payload: string | Buffer;
        qos: number;  // 0, 1, or 2
        retain: boolean;
    }
}
