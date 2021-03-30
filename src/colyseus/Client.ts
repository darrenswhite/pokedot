import {Client as ColClient} from 'colyseus.js';
import {SchemaConstructor} from 'colyseus.js/lib/serializer/SchemaSerializer';
import {Room} from './Room';

export class Client extends ColClient {
  protected createRoom<T>(
    roomName: string,
    rootSchema?: SchemaConstructor<T>
  ): Room<T> {
    return new Room<T>(roomName, rootSchema);
  }
}
