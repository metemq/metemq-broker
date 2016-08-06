import { BrokerEventHandler } from './handler';

export class DisconnectHandler extends BrokerEventHandler {

    public async request(payload, event, detail): Promise<boolean> {
        if (event === 'disconnect') {
            const thingId = payload;

            // console.log(`thingId: ${thingId} is disconnected!`);

            await this.broker.publish(`${thingId}/$disconnect`);

            return true;
        } else {
            return false;
        }
    }
}
