import { BrokerEventHandler } from './handler';

export class SubscribeEvent extends BrokerEventHandler {

    public async request(payload, event, detail): Promise<boolean> {
        if (event === 'new' && detail === 'subscribes') {
            let obj = JSON.parse(payload);

            // console.log(`thingId: ${obj.clientId} subscribe to {${obj.topic}}`);

            return true;
        } else {
            return false;
        }
    }
}
