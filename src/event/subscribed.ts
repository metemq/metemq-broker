import { Handler } from './handler';

export class SubscribeEvent extends Handler {
  
    public request(payload, event, detail): Promise<boolean> {
        if (event === 'new' && detail === 'subscribes') {
            let obj = JSON.parse(payload);

            console.log(`thingId: ${obj.clientId} subscribe to {${obj.topic}}`);

            return Promise.resolve(true);
        } else {
            return Promise.resolve(false);
        }
    }
}
