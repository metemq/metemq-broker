import mosca = require('mosca');
import { MOSCA_DEFAULT_OPTIONS } from './config';

export class Broker {

    private mqtt: mosca.Server = undefined;

    constructor() {
        this.mqtt = new mosca.Server(MOSCA_DEFAULT_OPTIONS);
    }

    on(event: string, listener: Function): Broker {
        this.mqtt.on(event, listener);
        return this;
    }

    publish(topic: string, payload?: string, options?: MqttPacketOptions)
    publish(topic: string, payload?: Object, options?: MqttPacketOptions)
    publish(topic: string, payload?, options?: MqttPacketOptions): Promise<any> {
        if (typeof payload === 'object')
            payload = JSON.stringify(payload);
        if (typeof payload === 'undefined')
            payload = '';
        if (typeof options === 'undefined')
            options = {};

        let packet: mosca.MqttPacket = {
            topic: topic,
            payload: payload,
            qos: options.qos,
            retain: options.retain
        }

        return new Promise((resolve, reject) => {
            this.mqtt.publish(packet, resolve);
        });
    }

    set authenticate(fn: (client, username, password, callback) => void) {
        this.mqtt.authenticate = fn;
    }

    set authorizePublish(fn: (client, topic, payload, callback) => void) {
        this.mqtt.authorizePublish = fn;
    }

    set authorizeSubscribe(fn: (client, topic, callback) => void) {
        this.mqtt.authorizeSubscribe = fn;
    }



    private static broker = undefined;

    public static getInstance(): Broker {
        if (this.broker === undefined)
            this.broker = new Broker();

        return this.broker;
    }
}

export interface MqttPacketOptions {
    qos?: number;  // 0, 1, or 2
    retain?: boolean;
}
