declare module 'mqtt-emitter' {
    import EventEmitter = NodeJS.EventEmitter;

    type Handler =
        (payload?: any, params?: Object, topic?: string, topicPatter?: string)
            => void;

    class MqttEmitter {
        on(topicPattern: string, handler: Handler): void;
        once(topicPattern: string, handler: Handler): void;
        emit(topic: string, payload: any);
        removeListener(topicPattern: string, handler: Handler): void;
    }

    export = MqttEmitter;
}
