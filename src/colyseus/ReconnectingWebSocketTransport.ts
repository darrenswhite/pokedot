import {
  ITransport,
  ITransportEventMap,
} from 'colyseus.js/lib/transport/ITransport';
import NodeWebSocket from 'ws';
import ReconnectingWebSocket from 'reconnecting-websocket';

const WebSocket = globalThis.WebSocket || NodeWebSocket;

export class ReconnectingWebSocketTransport implements ITransport {
  ws!: ReconnectingWebSocket;
  protocols?: string | string[];

  constructor(public events: ITransportEventMap) {}

  public send(data: ArrayBuffer | Array<number>): void {
    if (data instanceof ArrayBuffer) {
      this.ws.send(data);
    } else if (Array.isArray(data)) {
      this.ws.send(new Uint8Array(data).buffer);
    }
  }

  public connect(url: string): void {
    this.ws = new ReconnectingWebSocket(url, this.protocols, {
      WebSocket,
    });
    this.ws.binaryType = 'arraybuffer';
    if (this.events.onopen) {
      this.ws.addEventListener('open', this.events.onopen);
    }
    if (this.events.onmessage) {
      this.ws.addEventListener('message', this.events.onmessage);
    }
    if (this.events.onclose) {
      this.ws.addEventListener('close', this.events.onclose);
    }
    if (this.events.onerror) {
      this.ws.addEventListener('error', this.events.onerror);
    }
  }

  public close(code?: number, reason?: string): void {
    this.ws.close(code, reason);
  }
}
