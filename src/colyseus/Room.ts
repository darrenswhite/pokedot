import {Room as ColRoom} from 'colyseus.js';
import {Connection} from './Connection';

export class Room<T> extends ColRoom<T> {
  public connect(endpoint: string): void {
    this.connection = new Connection();
    this.connection.events.onmessage = this.onMessageCallback.bind(this);
    this.connection.events.onclose = (e: CloseEvent) => {
      if (!this.hasJoined) {
        console.warn(
          `Room connection was closed unexpectedly (${e.code}): ${e.reason}`
        );
        this.onError.invoke(e.code, e.reason);
        return;
      }

      this.onLeave.invoke(e.code);
      this._destroy();
    };
    this.connection.events.onerror = (e: CloseEvent) => {
      console.warn(`Room, onError (${e.code}): ${e.reason}`);
      this.onError.invoke(e.code, e.reason);
    };
    this.connection.connect(endpoint);
  }

  private _destroy() {
    if (this.serializer) {
      this.serializer.teardown();
    }
  }
}
