import { Handler } from './handler';
import { Broker } from '../broker';

let broker = Broker.getInstance();

export class DisconnectHandler extends Handler {

    public async request(payload, event, detail): Promise<boolean> {
        if (event === 'disconnect') {
            const thingId = payload;

            console.log(`thingId: ${thingId} is disconnected!`);

            await broker.publish(`${thingId}/$disconnect`);

            return true;
        } else {
            return false;
        }
    }
}
