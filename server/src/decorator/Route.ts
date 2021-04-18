import {RequestMethod} from './RequestMethod';

export interface Route {
  path: string;
  method: RequestMethod;
  methodName: string;
}
