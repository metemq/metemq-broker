import { ConnectHandler } from './event/connected';
import { DisconnectHandler } from './event/disconnected';
import { SubscribeEvent } from './event/subscribed';
import { UnsubscribeEvent } from './event/unsubscribed';

export const EventHandler = new ConnectHandler();

EventHandler.setNext(new DisconnectHandler());
EventHandler.setNext(new SubscribeEvent());
EventHandler.setNext(new UnsubscribeEvent());
