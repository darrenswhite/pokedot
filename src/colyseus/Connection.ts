import {Connection as ColConnection} from 'colyseus.js/lib/Connection';
import {ReconnectingWebSocketTransport} from './ReconnectingWebSocketTransport';

export class Connection extends ColConnection {
  constructor() {
    super();
    this.transport = new ReconnectingWebSocketTransport(this.events);
  }
}
