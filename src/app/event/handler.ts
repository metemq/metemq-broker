import { Broker } from '../broker';

export abstract class BrokerEventHandler {
    protected nextHandler = null;
    protected broker: Broker;

    constructor(broker: Broker) {
        this.broker = broker;
    }

    public setNext(handler: BrokerEventHandler) {
        let h = this;

        while (h.nextHandler !== null) {
            h = h.nextHandler;
        }
        h.nextHandler = handler;
    }

    public async process(payload, event, detail) {
        if (await this.request(payload, event, detail) === false) {
            if (this.nextHandler === null) {
                // console.log(`Undefined event: ${event}/${detail}`);
            } else {
                this.nextHandler.process(payload, event, detail);
            }
        }
    }

    public abstract async request(payload, event, detail): Promise<boolean>;
}
