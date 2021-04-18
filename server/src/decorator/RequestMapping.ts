import {Logger} from '../util/Logger';

import {RequestMethod} from './RequestMethod';
import {Route} from './Route';

export interface RequestMappingMetadata {
  path?: string | string[];
  method?: RequestMethod;
}

const defaultMetadata = {
  path: '/',
  method: RequestMethod.GET,
};

export const RequestMapping = (
  metadata: RequestMappingMetadata = defaultMetadata
): MethodDecorator => {
  const pathMetadata = metadata.path;
  const path =
    pathMetadata && pathMetadata.length ? (pathMetadata as string) : '/';
  const method = metadata.method || RequestMethod.GET;

  return (target, key) => {
    const methodName = key as string;
    let routes: Array<Route>;

    Logger.info({methodName, path, method}, 'Found request mapping.');

    if (Reflect.hasMetadata('routes', target.constructor)) {
      routes = Reflect.getMetadata(
        'routes',
        target.constructor
      ) as Array<Route>;
    } else {
      routes = [];
    }

    routes.push({
      method,
      path,
      methodName,
    });

    Reflect.defineMetadata('routes', routes, target.constructor);
  };
};

const createMappingDecorator = (method: RequestMethod) => (
  path?: string | string[]
): MethodDecorator => {
  return RequestMapping({
    path,
    method,
  });
};

export const Post = createMappingDecorator(RequestMethod.POST);

export const Get = createMappingDecorator(RequestMethod.GET);

export const Delete = createMappingDecorator(RequestMethod.DELETE);

export const Put = createMappingDecorator(RequestMethod.PUT);

export const Patch = createMappingDecorator(RequestMethod.PATCH);

export const Options = createMappingDecorator(RequestMethod.OPTIONS);

export const Head = createMappingDecorator(RequestMethod.HEAD);

export const All = createMappingDecorator(RequestMethod.ALL);
