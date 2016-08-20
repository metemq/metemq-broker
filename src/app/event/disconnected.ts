import { BrokerEventHandler } from './handler';
import { SERVER_ID } from '../config';

export class DisconnectHandler extends BrokerEventHandler {

    public async request(payload, event, detail): Promise<boolean> {
        if (event === 'disconnect') {
            const thingId = payload;

            await this.broker.publish(`${thingId}/$disconnect`);

            return true;
        } else {
            return false;
        }
    }
}
