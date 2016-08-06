import { BrokerEventHandler } from './handler';

export class ConnectHandler extends BrokerEventHandler {

    public async request(payload, event, detail): Promise<boolean> {
        if (event === 'new' && detail === 'clients') {
            // console.log(`thingId: ${payload} is connected!`);

            return true;
        } else {
            return false;
        }
    }
}
