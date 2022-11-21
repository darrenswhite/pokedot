import {RequestMethod} from './RequestMethod.js';

export interface Route {
  path: string;
  method: RequestMethod;
  methodName: string;
}
