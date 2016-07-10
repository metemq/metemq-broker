import { Handler } from './handler';

export class ConnectHandler extends Handler {
    public request(payload, event, detail): boolean {
        if (event === 'new' && detail === 'clients') {
            console.log(`thingId: ${payload} is connected!`);

            return true;
        } else {
            return false;
        }
    }
}
