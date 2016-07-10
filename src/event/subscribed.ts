import { Handler } from './handler';

export class SubscribeEvent extends Handler {
    public request(payload, event, detail): boolean {
        if (event === 'new' && detail === 'subscribes') {
            let obj = JSON.parse(payload);

            console.log(`thingId: ${obj.clientId} subscribe to {${obj.topic}}`);

            return true;
        } else {
            return false;
        }
    }
}
