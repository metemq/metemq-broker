import * as mqtt from 'mqtt';
import { assert } from 'chai';

import '../../app/index';
import { Broker } from '../../app/broker';

const broker = Broker.getInstance();

describe('function userAuth', function() {

    let server: mqtt.Client;
    let thing: mqtt.Client;

    before(function(done) {
        server = mqtt.connect('mqtt://localhost', { clientId: '$SERVER' });
        server.once('connect', () => server.subscribe('#', () => done()));
        server.on('message', (topic, message) => {
            const payload = message.toString();
            console.log(`[${topic}]->${payload}`);
        })
    });

    after(function() {
        thing.end();
        server.end();
        broker.stop();
    });

    it('should send $connect message to server', function(done) {
        thing = mqtt.connect('mqtt://localhost', { clientId: 'myThing01' });
        thing.once('connect', () => {
            thing.end();
            done();
        });

        server.once('message', (topic) => {
            const levels = topic.split('/');
            assert.equal(levels[0], 'myThing01');
            assert.equal(levels[1], '$connect');
            server.publish(`${levels[0]}/$connack/${levels[2]}`, 'true');
        });
    });

    it('should send $connect with username & password', function(done) {
        thing = mqtt.connect('mqtt://localhost', {
            clientId: 'myThing02',
            username: 'user01',
            password: 'secret'
        });
        thing.once('connect', () => {
            thing.end();
            done();
        });

        server.once('message', (topic, message) => {
            const payload = message.toString();
            const levels = topic.split('/');
            const parsed = JSON.parse(payload);
            assert.equal(levels[0], 'myThing02');
            assert.equal(levels[1], '$connect');
            assert.equal(parsed.username, 'user01');
            assert.equal(parsed.password, 'secret');
            server.publish(`${levels[0]}/$connack/${levels[2]}`, 'true');
        });
    });
});
