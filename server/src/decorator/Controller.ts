import {
  IRouterMatcher,
  NextFunction,
  Request,
  RequestHandler,
  Response,
  Router,
} from 'express';
import {Container} from 'typescript-ioc';

import {Logger} from '../util/Logger';

import {RequestMethod} from './RequestMethod';
import {Route} from './Route';

interface Controller {
  [key: string]: RequestHandler;
}

type ControllerConstructor = new (...args: never[]) => unknown;

export const Controller = (prefix = '/'): ClassDecorator => {
  return target => {
    Logger.info({target, prefix}, 'Found controller mapping.');

    Reflect.defineMetadata('prefix', prefix, target);
  };
};

export const Controllers = (controllers: ControllerConstructor[]): Router => {
  const router = Router();

  controllers.forEach(controller => {
    const instance = Container.get<Controller>(controller);
    const prefix = Reflect.getMetadata('prefix', controller) as string;
    const routes = Reflect.getMetadata('routes', controller) as Array<Route>;
    const controllerName = controller.name;

    if (prefix) {
      if (routes && routes.length > 0) {
        routes.forEach(route => {
          const {method, path, methodName} = route;
          const fullPath = prefix + path;

          Logger.info(
            {fullPath, method, controllerName, methodName},
            'Creating route...'
          );

          const routerMethod = getRouterMethod(router, method).bind(router);
          const instanceMethod = instance[methodName];

          if (instanceMethod) {
            routerMethod(
              fullPath,
              asyncMiddleware(instanceMethod.bind(instance))
            );
          } else {
            Logger.warn(
              {fullPath, method, controllerName, methodName},
              'Method does not exist on controller.'
            );
          }
        });
      } else {
        Logger.warn({controllerName}, 'No routes found for controller.');
      }
    } else {
      Logger.warn(
        {controllerName},
        'Registered controller has missing @Controller decorator.'
      );
    }
  });

  return router;
};

const getRouterMethod = (
  router: Router,
  requestMethod: RequestMethod
): IRouterMatcher<Router> => {
  switch (requestMethod) {
    case RequestMethod.POST:
      return router.post;
    case RequestMethod.ALL:
      return router.use;
    case RequestMethod.DELETE:
      return router.delete;
    case RequestMethod.PUT:
      return router.put;
    case RequestMethod.PATCH:
      return router.patch;
    case RequestMethod.OPTIONS:
      return router.options;
    case RequestMethod.HEAD:
      return router.head;
    default: {
      return router.get;
    }
  }
};

const asyncMiddleware = (
  fn: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void | PromiseLike<void>
) => (req: Request, res: Response, next: NextFunction): void => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
