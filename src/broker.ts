import mosca = require('mosca');

export class Broker {
    static broker = null;

    public static getInstance(options?) {
        if (this.broker === null) {
            this.broker = new mosca.Server(options);
        }

        return this.broker;
    }
}
