import { Handler } from './handler';

export class ConnectHandler extends Handler {

    public request(payload, event, detail): Promise<boolean> {
        if (event === 'new' && detail === 'clients') {
            console.log(`thingId: ${payload} is connected!`);

            return Promise.resolve(true);
        } else {
            return Promise.resolve(false);
        }
    }
}
