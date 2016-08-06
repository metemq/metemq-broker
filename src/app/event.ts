import { ConnectHandler } from './event/connected';
import { DisconnectHandler } from './event/disconnected';
import { SubscribeEvent } from './event/subscribed';
import { UnsubscribeEvent } from './event/unsubscribed';
import { BrokerEventHandler } from './event/handler';
import { Broker } from './broker';

export function createEventHandler(broker: Broker): BrokerEventHandler {
    let eventHandler = new ConnectHandler(broker);

    eventHandler.setNext(new DisconnectHandler(broker));
    eventHandler.setNext(new SubscribeEvent(broker));
    eventHandler.setNext(new UnsubscribeEvent(broker));

    return eventHandler;
}
