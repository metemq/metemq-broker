export abstract class Handler {
    nextHandler = null;

    public setNext(handler: Handler) {
        let h = this;

        while (h.nextHandler !== null) {
            h = h.nextHandler;
        }
        h.nextHandler = handler;
    }

    public async process(payload, event, detail) {
        if (await this.request(payload, event, detail) === false) {
            if (this.nextHandler === null) {
                console.log(`Undefined event: ${event}/${detail}`);
            } else {
                this.nextHandler.process(payload, event, detail);
            }
        }
    }

    public abstract async request(payload, event, detail): Promise<boolean>;
}
