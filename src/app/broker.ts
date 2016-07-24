import mosca = require('mosca');
import MqttEmitter = require('mqtt-emitter');
import { MOSCA_DEFAULT_OPTIONS, SERVER_RESPONSE_TIMEOUT } from './config';

export class Broker {

    private mqtt: mosca.Server = undefined;
    private emitter = new MqttEmitter();

    constructor() {
        this.mqtt = new mosca.Server(MOSCA_DEFAULT_OPTIONS);
        // Set emitter
        this.mqtt.on('published', (packet, client) => {
            let topic = packet.topic;
            let payload = packet.payload.toString();

            // Parse payload if it's possible
            let parsed = null;
            try { parsed = JSON.parse(payload) } catch (e) { }
            if (parsed) payload = parsed;

            this.emitter.emit(topic, payload);
        });
    }

    on(event: string, listener: Function): Broker {
        this.mqtt.on(event, listener);
        return this;
    }

    when(topicPattern: string): Promise<{ payload: any, params: Object }> {
        return new Promise((resolve, reject) => {
            // Setup timer to detect SERVER_RESPONSE_TIMEOUT
            const timer = setTimeout(() => {
                reject('Server response timeout');
                this.emitter.removeListener(topicPattern, handler);
            }, SERVER_RESPONSE_TIMEOUT);
            // Set once event listener
            this.emitter.once(topicPattern, handler);
            // Handler for topic
            function handler(payload, params) {
                resolve({ payload: payload, params: params });
                clearTimeout(timer);
            }
        });
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

    stop() {
        this.mqtt.close();
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
