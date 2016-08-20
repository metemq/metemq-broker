import * as mqtt from 'mqtt';
import { assert } from 'chai';
import '../../app/index';
import { Broker } from '../../app/broker';
import crypto = require("crypto-js");

describe('Server Authentication', function() {

    let broker: Broker;
    let server: mqtt.Client;

    before(function(done) {
        broker = new Broker();
        broker.on('ready', function() {
            console.log('Broker is up and running');
            done();
        });
        broker.on('published', function(packet) {
            console.log(`[${packet.topic}]->${packet.payload.toString()}`);
        });
    });

    after(function() {
        broker.close();
    });

    it('should connect the server with username, password', function(done) {
        server = mqtt.connect('mqtt:localhost', { clientId: '$SERVER', username: 'localhost', password: 'localhost'});
        server.once('connect', () => {
            server.end();
            done();
        });
    });

    it('should refuse the connection if username, password is undefined', function(done) {
        server = mqtt.connect('mqtt:localhost', { clientId: '$SERVER' });
        server.once('error', () => { done() });
    });

    it('should refuse the connection if username is exist but password is not', function(done) {
        server = mqtt.connect('mqtt:localhost', { clientId: '$SERVER', username: 'localhost' });
        server.once('error', () => { done() });
    })

    it('should refuse the connection if password is mismatch', function(done) {
        server = mqtt.connect('mqtt:localhost', { clientId: '$SERVER', username: 'localhost', password: 'aa' });
        server.once('error', () => { done() });
    })
});
