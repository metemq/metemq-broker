import { Handler } from './handler';

export class UnsubscribeEvent extends Handler {
  
    public async request(payload, event, detail): Promise<boolean> {
        if (event === 'new' && detail === 'unsubscribes') {
            let obj = JSON.parse(payload);

            console.log(`thingId: ${obj.clientId} unsibscribe to {${obj.topic}}`);

            return true;
        } else {
            return false;
        }
    }
}
