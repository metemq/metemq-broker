import { Handler } from './handler';

export class DisconnectHandler extends Handler {
  
    public request(payload, event, detail): Promise<boolean> {
        if (event === 'disconnect') {
            console.log(`thingId: ${payload} is disconnected!`);

            return Promise.resolve(true);
        } else {
            return Promise.resolve(false);
        }
    }
}
