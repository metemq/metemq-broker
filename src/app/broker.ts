import mosca = require('mosca');
import shortid = require('shortid');
import MqttEmitter = require('mqtt-emitter');
import { MOSCA_DEFAULT_OPTIONS, SERVER_RESPONSE_TIMEOUT } from './config';
import { createEventHandler } from './event';
import { SERVER_ID } from './config';

export class Broker {

    private mqtt: mosca.Server;
    private emitter = new MqttEmitter();
    private handler = createEventHandler(this);

    constructor(options?) {
        // Use default options if there is no user-defined options
        if (options == undefined)
            options = MOSCA_DEFAULT_OPTIONS;
        // Create Mosca server object with options
        this.mqtt = new mosca.Server(options);
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

        // Setup $SYS topic handler
        this.mqtt.on('published', (packet, client) => {
            let topic = packet.topic;
            let payload = packet.payload.toString();

            // When broker publishes a message, client object is undefined.
            if (client === undefined || client === null) {
                let topics = topic.split('/');
                this.handler.process(payload, topics[2], topics[3]);
                return;
            };
        });

        // Should wray functions in order to apply functions in context of 'this' broker
        this.mqtt.authenticate = (client, username, password, callback) =>
            this.thingAuth(client, username, password, callback);

        this.mqtt.authorizePublish = (client, topic, payload, callback) =>
            this.pubAuth(client, topic, payload, callback);

        this.mqtt.authorizeSubscribe = (client, topic, callback) =>
            this.subAuth(client, topic, callback);
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

    private async thingAuth(client, username, password: Buffer, callback) {
        const clientId = client.id;

        // Server authentication
        if (clientId === SERVER_ID)
            return this.serverAuth(username, password, callback);

        // Deny if there is no password but username
        if (username && !password) return callback('No password error', false);
        // Client ID is thingId if the client is not server
        const thingId = clientId;
        // Generate unique ID
        const msgId = shortid.generate();
        // Send $connect message to server
        const payload = {
            username: username,
            password: password ? password.toString() : password
        }
        await this.publish(`${thingId}/$connect/${msgId}`, payload);

        let error;
        try {
            // Receive $connack message
            let result = await this.when(`${thingId}/$connack/${msgId}`);
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

    private serverAuth(username, password, callback) {
        callback(null, true);
    }

    private pubAuth(client, topic, payload, callback) {
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

    private subAuth(client, topic, callback) {
        let clientId = client.id;
        console.log(`subAuth ${clientId}`)
        if (clientId === SERVER_ID)
            return callback(null, true);

        const topics = topic.split('/');
        const thingId = topics[0];

        if (clientId === thingId) callback(null, true);
        else callback(`Miss match id`, false);
    }

}

export interface MqttPacketOptions {
    qos?: number;  // 0, 1, or 2
    retain?: boolean;
}
