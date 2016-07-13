import { Handler } from './handler';

export class DisconnectHandler extends Handler {
    public request(payload, event, detail): boolean {
        if (event === 'disconnect') {
            console.log(`thingId: ${payload} is disconnected!`);

            return true;
        } else {
            return false;
        }
    }
}
